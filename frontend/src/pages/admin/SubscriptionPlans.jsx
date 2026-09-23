import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Plus, Pencil, Trash2, Loader2, X, Ban, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import {
  getAdminSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  updateSubscriptionPlanStatus,
  deleteSubscriptionPlan,
} from '../../services/subscriptionPlan.service';

const emptyForm = {
  name: '',
  slug: '',
  price: '',
  currency: 'ETB',
  duration_days: '30',
  property_limit: '',
  images_per_property: '',
  features: '',
  description: '',
  is_active: true,
};

const CURRENCIES = ['ETB', 'USD', 'EUR', 'GBP'];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const formatPrice = (price) => Number(price || 0).toLocaleString();

const parseFeatureText = (text) =>
  typeof text === 'string' && text.trim()
    ? text.split(/[,\n]/).map((item) => item.trim()).filter(Boolean)
    : [];

const inputClass =
  'w-full h-[38px] px-3 rounded-md border border-[#E5E7EB] text-[13px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E7B85A]/50';

const Field = ({ label, htmlFor, error, children }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={htmlFor} className="text-[12px] font-medium text-[#374151]">
      {label}
    </label>
    {children}
    {error ? (
      <p role="alert" className="text-[12px] text-[#B23B36]">
        {error}
      </p>
    ) : null}
  </div>
);

const SubscriptionPlans = () => {
  const { t } = useTranslation('admin');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmToggleId, setConfirmToggleId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const [refreshError, setRefreshError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const formCardRef = useRef(null);

  const fetchPlans = async () => {
    const data = await getAdminSubscriptionPlans();
    setPlans(data);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await fetchPlans();
      } catch (err) {
        if (!active) return;
        setLoadError(err.message || t('plans_error_load'));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [t]);

  const retryInitialLoad = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      await fetchPlans();
    } catch (err) {
      setLoadError(err.message || t('plans_error_load'));
    } finally {
      setLoading(false);
    }
  };

  const reload = async () => {
    setRefreshing(true);
    try {
      await fetchPlans();
      setRefreshError(null);
    } catch (err) {
      setRefreshError(err.message || t('plans_error_refresh'));
    } finally {
      setRefreshing(false);
    }
  };

  const validateForm = (values) => {
    const errors = {};
    const name = String(values.name || '').trim();
    const slug = String(values.slug || '').trim().toLowerCase();
    const priceRaw = String(values.price || '').trim();
    const price = priceRaw ? Number(priceRaw) : NaN;
    const durationDays = Number(values.duration_days);
    const propertyLimit = Number(values.property_limit);
    const imagesPerProperty = Number(values.images_per_property);

    if (!name) errors.name = t('plans_err_name_required');
    else if (name.length > 100) errors.name = t('plans_err_name_max');

    if (!priceRaw) errors.price = t('plans_err_price_required');
    else if (!Number.isFinite(price) || price < 0) errors.price = t('plans_err_price_number');

    if (!slug) errors.slug = t('plans_err_slug_required');
    else if (slug.length > 100) errors.slug = t('plans_err_slug_max');
    else if (!slugPattern.test(slug)) errors.slug = t('plans_err_slug_format');

    if (!Number.isFinite(price) || price < 0) errors.price = t('plans_err_price_number');
    if (!Number.isInteger(durationDays) || durationDays <= 0)
      errors.duration_days = t('plans_err_duration');
    if (!Number.isInteger(propertyLimit) || propertyLimit <= 0)
      errors.property_limit = t('plans_err_prop_limit');
    if (!Number.isInteger(imagesPerProperty) || imagesPerProperty <= 0)
      errors.images_per_property = t('plans_err_image_limit');

    const features = parseFeatureText(values.features);
    if (features.length > 20) errors.features = t('plans_err_features_max');
    else if (features.some((item) => item.length > 100))
      errors.features = t('plans_err_feature_length');

    return errors;
  };

  const buildPayload = (values) => {
    const features = parseFeatureText(values.features);
    return {
      name: String(values.name).trim(),
      slug: String(values.slug).trim().toLowerCase(),
      price: String(values.price || '').trim() ? Number(String(values.price || '').trim()) : NaN,
      currency: String(values.currency || 'ETB').trim().toUpperCase(),
      duration_days: Number(values.duration_days),
      property_limit: Number(values.property_limit),
      images_per_property: Number(values.images_per_property),
      description: String(values.description || '').trim() || null,
      features: features.length ? features : null,
      is_active: Boolean(values.is_active),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = buildPayload(form);
      if (editingId) {
        await updateSubscriptionPlan(editingId, payload);
        setSuccess(t('plans_updated', { name: payload.name }));
      } else {
        await createSubscriptionPlan(payload);
        setSuccess(t('plans_created', { name: payload.name }));
      }
    } catch (err) {
      setFormErrors({ form: err.message || t('plans_error_save') });
      setSaving(false);
      return;
    }
    setForm(emptyForm);
    setFormErrors({});
    setEditingId(null);
    await reload();
    setSaving(false);
  };

  const startEdit = (plan) => {
    setEditingId(plan.id);
    setForm({
      name: plan.name,
      slug: plan.slug,
      price: String(plan.price),
      currency: plan.currency || 'ETB',
      duration_days: String(plan.duration_days),
      property_limit: String(plan.property_limit),
      images_per_property: String(plan.images_per_property),
      features: Array.isArray(plan.features) ? plan.features.join(', ') : '',
      description: plan.description || '',
      is_active: Boolean(plan.is_active),
    });
    setFormErrors({});
    setConfirmDeleteId(null);
    setConfirmToggleId(null);
    formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
  };

  const handleToggleStatus = async (plan) => {
    const nextActive = !plan.is_active;
    setTogglingId(plan.id);
    setError(null);
    setSuccess(null);
    try {
      await updateSubscriptionPlanStatus(plan.id, nextActive);
    } catch (err) {
      setError(err.message || t('plans_error_status'));
      setTogglingId(null);
      return;
    }
    setSuccess(
      nextActive
        ? t('plans_activated', { name: plan.name })
        : t('plans_deactivated', { name: plan.name })
    );
    if (editingId === plan.id) {
      setForm((prev) => ({ ...prev, is_active: nextActive }));
    }
    setConfirmToggleId(null);
    await reload();
    setTogglingId(null);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setError(null);
    setSuccess(null);
    try {
      await deleteSubscriptionPlan(id);
    } catch (err) {
      setError(err.message || t('plans_error_delete'));
      setDeletingId(null);
      return;
    }
    setSuccess(t('plans_deleted'));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
      setFormErrors({});
    }
    setConfirmDeleteId(null);
    await reload();
    setDeletingId(null);
  };

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  if (loading) {
    return <div className="py-20 text-center text-[#6B7280]">{t('plans_loading')}</div>;
  }

  if (loadError) {
    return (
      <div className="py-20 flex flex-col items-center gap-3 font-sans">
        <p role="alert" className="text-[13px] text-[#B23B36]">
          {t('plans_load_prefix')}{loadError}
        </p>
        <button
          type="button"
          onClick={retryInitialLoad}
          className="inline-flex items-center h-[36px] px-4 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F8] transition-colors"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  const actionBusy = saving || deletingId !== null || togglingId !== null;

  return (
    <div className="space-y-5 font-sans">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D6FD3] mb-1">
            {t('eyebrow_management')}
          </p>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="w-10 h-10 rounded-xl bg-[#E7F0FB] text-[#4A9FF5] flex items-center justify-center shrink-0"
            >
              <CreditCard size={20} />
            </span>
            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
              {t('plans_title')}
            </h1>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-1">
            {t('plans_subtitle')}
          </p>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-md bg-[#FBE9E8] text-[#B23B36] text-[13px] px-4 py-3">
          {error}
        </div>
      )}
      {success && (
        <div aria-live="polite" className="rounded-md bg-[#E6F4EC] text-[#2F7A55] text-[13px] px-4 py-3">
          {success}
        </div>
      )}
      {refreshError && (
        <div
          role="alert"
          className="rounded-md bg-[#FBF3DD] text-[#8a6d1f] text-[13px] px-4 py-3 flex items-center justify-between gap-3"
        >
          <span>{t('saved_refresh_failed')}{refreshError}</span>
          <button
            type="button"
            onClick={() => reload()}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-md bg-white border border-[#e5d9a8] text-[12px] font-medium text-[#8a6d1f] hover:bg-[#fdf8ea] transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {refreshing ? <Loader2 size={14} className="animate-spin" /> : null}
            {t('retry')}
          </button>
        </div>
      )}

      {/* Add / Edit plan form */}
      <form
        ref={formCardRef}
        onSubmit={handleSubmit}
        className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_2px_8px_rgba(15,23,42,0.06)] p-4 scroll-mt-24"
      >
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <h2 className="text-[17px] font-semibold text-[#111827]">
            {editingId ? t('plans_edit_title') : t('plans_add_title')}
          </h2>
          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
              className="inline-flex items-center gap-1.5 h-[32px] px-3 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F8] transition-colors disabled:opacity-50"
            >
              <X size={15} />
              {t('cancel_edit')}
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Field label={t('plans_field_name')} htmlFor="plan-name" error={formErrors.name}>
            <input
              id="plan-name"
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder={t('plans_ph_name')}
              maxLength={100}
              className={inputClass}
            />
          </Field>
          <Field label={t('plans_field_slug')} htmlFor="plan-slug" error={formErrors.slug}>
            <input
              id="plan-slug"
              type="text"
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              placeholder={t('plans_ph_slug')}
              maxLength={100}
              className={inputClass}
            />
          </Field>
          <Field label={t('plans_field_price')} htmlFor="plan-price" error={formErrors.price}>
            <input
              id="plan-price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder={t('plans_ph_price')}
              className={inputClass}
            />
          </Field>
          <Field label={t('plans_field_currency')} htmlFor="plan-currency" error={formErrors.currency}>
            <select
              id="plan-currency"
              value={form.currency}
              onChange={(e) => set('currency', e.target.value)}
              className={inputClass}
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t('plans_field_duration')} htmlFor="plan-duration" error={formErrors.duration_days}>
            <input
              id="plan-duration"
              type="number"
              min="1"
              step="1"
              value={form.duration_days}
              onChange={(e) => set('duration_days', e.target.value)}
              placeholder={t('plans_ph_duration')}
              className={inputClass}
            />
          </Field>
          <Field
            label={t('plans_field_prop_limit')}
            htmlFor="plan-property-limit"
            error={formErrors.property_limit}
          >
            <input
              id="plan-property-limit"
              type="number"
              min="1"
              step="1"
              value={form.property_limit}
              onChange={(e) => set('property_limit', e.target.value)}
              placeholder={t('plans_ph_prop_limit')}
              className={inputClass}
            />
          </Field>
          <Field
            label={t('plans_field_images')}
            htmlFor="plan-images"
            error={formErrors.images_per_property}
          >
            <input
              id="plan-images"
              type="number"
              min="1"
              step="1"
              value={form.images_per_property}
              onChange={(e) => set('images_per_property', e.target.value)}
              placeholder={t('plans_ph_images')}
              className={inputClass}
            />
          </Field>
          <Field label={t('plans_field_visibility')} htmlFor="plan-active" error={formErrors.is_active}>
            <label
              htmlFor="plan-active"
              className="h-[38px] flex items-center gap-2 cursor-pointer"
            >
              <input
                id="plan-active"
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => set('is_active', e.target.checked)}
                className="h-4 w-4 accent-[#E7B85A]"
              />
              <span className="text-[13px] text-[#374151]">{t('plans_visibility_active')}</span>
            </label>
          </Field>
          <Field
            label={t('plans_field_features')}
            htmlFor="plan-features"
            error={formErrors.features}
          >
            <textarea
              id="plan-features"
              value={form.features}
              onChange={(e) => set('features', e.target.value)}
              rows={2}
              placeholder={t('plans_ph_features')}
              className={`${inputClass} h-auto min-h-[60px] py-2 resize-y`}
            />
          </Field>
          <div className="sm:col-span-2 flex flex-col gap-1">
            <Field label={t('plans_field_description')} htmlFor="plan-description" error={formErrors.description}>
              <textarea
                id="plan-description"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={2}
                maxLength={1000}
                placeholder={t('plans_ph_description')}
                className={`${inputClass} h-auto min-h-[60px] py-2 resize-y`}
              />
            </Field>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-1.5 h-[38px] px-4 rounded-md bg-[#E7B85A] text-[13px] font-semibold text-[#111827] hover:bg-[#dfae49] transition-colors disabled:opacity-50 whitespace-nowrap w-full"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {editingId ? t('save_changes') : t('plans_add')}
            </button>
          </div>
        </div>

        {formErrors.form && (
          <p role="alert" className="mt-3 text-[12px] text-[#B23B36]">
            {formErrors.form}
          </p>
        )}
      </form>

      {/* Plans table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_2px_8px_rgba(15,23,42,0.06)] overflow-hidden">
        <h2 className="text-[17px] font-semibold text-[#111827] px-4 py-3">{t('plans_all')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] text-[#111827] min-w-[880px]">
            <thead>
              <tr className="bg-[#F3F4F8] text-[#374151] font-medium text-[13px] h-[42px]">
                <th className="py-0 px-4 rounded-l-lg w-[18%]">{t('plans_col_plan')}</th>
                <th className="py-0 px-4 w-[12%]">{t('plans_col_price')}</th>
                <th className="py-0 px-4 w-[12%]">{t('plans_col_duration')}</th>
                <th className="py-0 px-4 w-[16%]">{t('plans_col_limits')}</th>
                <th className="py-0 px-4 w-[10%]">{t('col_status')}</th>
                <th className="py-0 px-4 w-[12%]">{t('col_created')}</th>
                <th className="py-0 px-4 w-[20%] rounded-r-lg">{t('col_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {plans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[13px] text-[#6B7280]">
                    {t('plans_empty')}
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id} className="h-[50px] hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-0 px-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#E7F0FB] text-[#4A9FF5]">
                          <CreditCard size={14} />
                        </span>
                        <div className="min-w-0">
                          <span className="font-medium truncate text-[#111827] block">
                            {plan.name}
                          </span>
                          <span className="text-[11px] text-[#6B7280]">{plan.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-0 px-4 text-[#374151] whitespace-nowrap">
                      {formatPrice(plan.price)} {plan.currency}
                    </td>
                    <td className="py-0 px-4 text-[#374151] whitespace-nowrap">
                      {t('plans_day', { count: plan.duration_days })}
                    </td>
                    <td className="py-0 px-4 text-[#374151] whitespace-nowrap">
                      {plan.property_limit}{t('plans_props_suffix')}{plan.images_per_property}{t('plans_img_suffix')}
                    </td>
                    <td className="py-0 px-4">
                      <StatusBadge status={plan.is_active ? 'active' : 'inactive'}>
                        {plan.is_active ? t('status_active') : t('status_inactive')}
                      </StatusBadge>
                    </td>
                    <td className="py-0 px-4 text-[#374151] whitespace-nowrap">
                      {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-0 px-4">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        {confirmToggleId === plan.id ? (
                          <>
                            <span className="text-[12px] text-[#8a6d1f]">
                              {plan.is_active ? t('plans_confirm_deactivate') : t('plans_confirm_activate')}
                            </span>
                            <button
                              type="button"
                              disabled={togglingId === plan.id}
                              onClick={() => handleToggleStatus(plan)}
                              className="inline-flex items-center gap-1.5 h-[30px] px-2.5 rounded-md bg-[#FBF3DD] border border-[#e5d9a8] text-[12px] font-medium text-[#8a6d1f] hover:bg-[#fdf8ea] transition-colors disabled:opacity-50"
                            >
                              {togglingId === plan.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={14} />
                              )}
                              {t('yes')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmToggleId(null)}
                              disabled={togglingId === plan.id}
                              className="h-[30px] px-2.5 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[12px] font-medium text-[#374151] hover:bg-[#F3F4F8] transition-colors disabled:opacity-50"
                            >
                              {t('no')}
                            </button>
                          </>
                        ) : confirmDeleteId === plan.id ? (
                          <>
                            <span className="text-[12px] text-[#B23B36]">{t('delete_confirm')}</span>
                            <button
                              type="button"
                              disabled={deletingId === plan.id}
                              onClick={() => handleDelete(plan.id)}
                              className="inline-flex items-center gap-1.5 h-[30px] px-2.5 rounded-md bg-[#FBE9E8] border border-[#f0cfce] text-[12px] font-medium text-[#B23B36] hover:bg-[#f6dcd9] transition-colors disabled:opacity-50"
                            >
                              {deletingId === plan.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                              {t('yes')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              disabled={deletingId === plan.id}
                              className="h-[30px] px-2.5 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[12px] font-medium text-[#374151] hover:bg-[#F3F4F8] transition-colors disabled:opacity-50"
                            >
                              {t('no')}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              disabled={actionBusy}
                              onClick={() => startEdit(plan)}
                              className="inline-flex items-center gap-1.5 h-[32px] px-3 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F8] transition-colors disabled:opacity-50"
                            >
                              <Pencil size={15} />
                              {t('edit')}
                            </button>
                            <button
                              type="button"
                              disabled={actionBusy}
                              onClick={() => setConfirmToggleId(plan.id)}
                              className={`inline-flex items-center gap-1.5 h-[32px] px-3 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[13px] font-medium transition-colors disabled:opacity-50 ${
                                plan.is_active
                                  ? 'text-[#8a6d1f] hover:bg-[#fdf8ea]'
                                  : 'text-[#2F7A55] hover:bg-[#e3f3ea]'
                              }`}
                            >
                              {plan.is_active ? <Ban size={15} /> : <CheckCircle2 size={15} />}
                              {plan.is_active ? t('plans_deactivate') : t('plans_activate')}
                            </button>
                            <button
                              type="button"
                              disabled={actionBusy}
                              onClick={() => setConfirmDeleteId(plan.id)}
                              className="inline-flex items-center gap-1.5 h-[32px] px-3 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[13px] font-medium text-[#B23B36] hover:bg-[#fbe9e8] transition-colors disabled:opacity-50"
                            >
                              <Trash2 size={15} />
                              {t('delete')}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;