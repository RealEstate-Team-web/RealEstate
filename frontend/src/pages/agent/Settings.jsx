import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings as SettingsIcon,
  Lock,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  Link2,
  MapPin,
  ChevronDown,
  ChevronUp,
  Wallet,
  Tag,
} from 'lucide-react';
import authService from '../../services/auth.service';
import { getCategories } from '../../services/category.service';
import { useToast } from '../../hooks/useToast';

const PREFS_KEY = 'agentNotificationPrefs';
const LISTING_PREFS_KEY = 'agentListingPrefs';

const DEFAULT_PREFS = {
  emailNotifications: true,
  visitRequestAlerts: true,
  inquiryAlerts: true,
};

const DEFAULT_LISTING_PREFS = {
  categories: [],
  minBudget: 0,
  maxBudget: 1000000,
  preferredLocations: '',
  listingAlert: true,
};

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
};

const CONNECTED_ACCOUNTS = [
  { id: 'google', name: 'Google', descriptionKey: 'settings_account_google', icon: 'G' },
  { id: 'apple', name: 'Apple', descriptionKey: 'settings_account_apple', icon: '' },
  { id: 'googleCalendar', name: 'Google Calendar', descriptionKey: 'settings_account_calendar', icon: '' },
];

const FIELD_STYLE =
  'w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#4A9FF5] font-medium transition';

const Settings = () => {
  const { toastMessage, toastTone, showToast } = useToast();
  const { t } = useTranslation('agents');

  const [prefs, setPrefs] = useState(() => readJson(PREFS_KEY, DEFAULT_PREFS));
  const [listingPrefs, setListingPrefs] = useState(() =>
    readJson(LISTING_PREFS_KEY, DEFAULT_LISTING_PREFS)
  );
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [storageStatus, setStorageStatus] = useState('saved');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  useEffect(() => {
    let active = true;
    getCategories()
      .then((list) => {
        if (!active) return;
        setCategories(Array.isArray(list) ? list : []);
        setCategoriesError('');
        setCategoriesLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setCategories([]);
        setCategoriesError(t('settings_error_categories'));
        setCategoriesLoading(false);
      });
    return () => {
      active = false;
    };
  }, [t]);

  useEffect(() => {
    let status = 'saved';
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
      localStorage.setItem(LISTING_PREFS_KEY, JSON.stringify(listingPrefs));
    } catch {
      status = 'error';
    }
    const timer = setTimeout(() => setStorageStatus(status), 0);
    return () => clearTimeout(timer);
  }, [prefs, listingPrefs]);

  const togglePref = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCategory = (name) => {
    setListingPrefs((prev) => {
      const has = prev.categories.includes(name);
      return {
        ...prev,
        categories: has
          ? prev.categories.filter((c) => c !== name)
          : [...prev.categories, name],
      };
    });
  };

  const validateNewPassword = () => {
    if (newPassword !== confirmPassword) return t('settings_password_mismatch');
    if (newPassword.length < 8) return t('settings_password_length');
    if (!/[A-Z]/.test(newPassword)) return t('settings_password_uppercase');
    if (!/[a-z]/.test(newPassword)) return t('settings_password_lowercase');
    if (!/[0-9]/.test(newPassword)) return t('settings_password_number');
    return null;
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);
    const validationMessage = validateNewPassword();
    if (validationMessage) {
      setPasswordError(validationMessage);
      return;
    }
    setPasswordSaving(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setPasswordSuccess(t('settings_password_success'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err?.message || t('settings_password_update_error'));
    } finally {
      setPasswordSaving(false);
    }
  };

  const updateBudget = (field, value) => {
    const parsed = Math.max(0, Math.min(1000000, Number(value)));
    setListingPrefs((prev) => {
      if (field === 'minBudget') {
        return {
          ...prev,
          minBudget: Math.min(parsed, prev.maxBudget),
          maxBudget: Math.max(parsed, prev.maxBudget),
        };
      }
      return {
        ...prev,
        maxBudget: Math.max(parsed, prev.minBudget),
        minBudget: Math.min(parsed, prev.minBudget),
      };
    });
  };

  const budgetFormatter = (value) => `Br ${Number(value).toLocaleString()}`;

  const selectedInterestCount = listingPrefs.categories.length;

  return (
    <div className="space-y-5 font-sans">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D6FD3] mb-1">
          {t('settings_title')}
        </p>
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="w-10 h-10 rounded-xl bg-[#E7F0FB] text-[#4A9FF5] flex items-center justify-center shrink-0"
          >
            <SettingsIcon size={20} />
          </span>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">{t('settings_account_title')}</h1>
        </div>
        <p className="text-[13px] text-[#6B7280] mt-1">
          {t('settings_account_sub')}
        </p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl divide-y divide-slate-100 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-9 h-9 bg-[#E6F4EC] text-[#2F7A55] rounded-xl flex items-center justify-center">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('settings_security_password')}</h3>
              <p className="text-xs text-slate-500">{t('settings_security_password_sub')}</p>
            </div>
          </div>

          {passwordError && (
            <div role="alert" className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-[13px] px-4 py-2.5 rounded-xl">
              <AlertCircle size={16} /> {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div role="status" className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] px-4 py-2.5 rounded-xl">
              <CheckCircle2 size={16} /> {passwordSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1" htmlFor="currentPassword">
                {t('settings_current_password')}
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(null); setPasswordSuccess(null); }}
                placeholder="••••••••"
                className={FIELD_STYLE}
              />
            </div>
            <div />
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1" htmlFor="newPassword">
                {t('settings_new_password')}
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setPasswordError(null); setPasswordSuccess(null); }}
                placeholder="••••••••"
                className={FIELD_STYLE}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1" htmlFor="confirmPassword">
                {t('settings_confirm_new_password')}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(null); setPasswordSuccess(null); }}
                placeholder="••••••••"
                className={FIELD_STYLE}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
              className="flex items-center space-x-2 bg-[#4A9FF5] hover:bg-[#3A8FE5] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-[0_4px_12px_rgba(74,159,245,0.25)] disabled:opacity-50"
            >
              <Save size={16} />
              <span>{passwordSaving ? t('settings_updating') : t('settings_update_password')}</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-9 h-9 bg-[#F5F0EB] text-[#E7B85A] rounded-xl flex items-center justify-center">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('settings_notification_prefs')}</h3>
              <p className="text-xs text-slate-500">{t('settings_notification_prefs_sub')}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[{ key: 'emailNotifications', title: t('settings_email_notif'), description: t('settings_email_notif_sub') },
              { key: 'visitRequestAlerts', title: t('settings_visit_alerts'), description: t('settings_visit_alerts_sub') },
              { key: 'inquiryAlerts', title: t('settings_inquiry_alerts'), description: t('settings_inquiry_alerts_sub') }].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer hover:bg-slate-100/50 transition"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{item.title}</p>
                  <p className="text-[11px] text-slate-500">{item.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs[item.key]}
                  onChange={() => togglePref(item.key)}
                  className="w-4 h-4 text-[#4A9FF5] rounded focus:ring-[#4A9FF5]"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-9 h-9 bg-[#EEF1F6] text-slate-500 rounded-xl flex items-center justify-center">
              <Link2 size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('settings_linked_accounts')}</h3>
              <p className="text-xs text-slate-500">{t('settings_linked_accounts_sub')}</p>
            </div>
          </div>
          <div className="space-y-3 pt-1">
            {CONNECTED_ACCOUNTS.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-[#4A9FF5] shrink-0">
                    {provider.icon || provider.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800">{provider.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{t(provider.descriptionKey)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast(t('settings_linking_soon', { name: provider.name }))}
                  className="text-[#4A9FF5] hover:bg-blue-50 border border-[#4A9FF5] px-4 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer shrink-0"
                >
                  {t('settings_connect')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 bg-[#E6F4EC] text-[#2F7A55] rounded-xl flex items-center justify-center">
                <Tag size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t('settings_listing_prefs')}</h3>
                <p className="text-xs text-slate-500">{t('settings_listing_prefs_sub')}</p>
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-700 mb-2">{t('settings_property_interests')}</p>
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
              {categoriesLoading ? (
                <p className="p-4 text-xs text-slate-500">{t('settings_loading_categories')}</p>
              ) : categoriesError ? (
                <p className="flex items-center space-x-2 p-4 text-xs text-rose-600">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{categoriesError}</span>
                </p>
              ) : categories.length === 0 ? (
                <p className="p-4 text-xs text-slate-500">{t('settings_no_categories')}</p>
              ) : (
                categories.map((category) => {
                  const isExpanded = expandedCategory === category.name;
                  const isSelected = listingPrefs.categories.includes(category.name);
                  return (
                    <div key={category.id}>
                      <div className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition">
                        <label className="flex items-center space-x-2.5 min-w-0 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleCategory(category.name)}
                            aria-label={`Select ${category.name}`}
                            className="w-4 h-4 text-[#4A9FF5] rounded focus:ring-[#4A9FF5]"
                          />
                          <span className="text-xs font-bold text-slate-800">{category.name}</span>
                          {isSelected && (
                            <CheckCircle2 size={14} className="text-[#2F7A55] shrink-0" />
                          )}
                        </label>
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() => setExpandedCategory(isExpanded ? null : category.name)}
                          className="flex items-center space-x-2 shrink-0 rounded-lg px-2 py-1 -mr-1 hover:bg-slate-100 transition cursor-pointer"
                          aria-label={isExpanded ? `Hide details for ${category.name}` : `Show details for ${category.name}`}
                        >
                          <span className="text-[11px] text-slate-400">{isSelected ? t('settings_added') : t('settings_add')}</span>
                          {isExpanded ? (
                            <ChevronUp size={16} className="text-slate-400" />
                          ) : (
                            <ChevronDown size={16} className="text-slate-400" />
                          )}
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="px-4 pb-3 -mt-1">
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {category.description} {t('settings_select_category_hint')}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {selectedInterestCount > 0
                ? t('settings_categories_selected', { count: selectedInterestCount })
                : t('settings_no_categories_selected')}
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
          <div className="p-6 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-[#FBF3DD] text-[#E7B85A] rounded-xl flex items-center justify-center">
                <Wallet size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t('settings_pricing_alerts')}</h3>
                <p className="text-xs text-slate-500">{t('settings_pricing_alerts_sub')}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-700">{t('settings_budget_range')}</p>
                <p className="text-xs font-bold text-[#4A9FF5]">
                  {budgetFormatter(listingPrefs.minBudget)} – {budgetFormatter(listingPrefs.maxBudget)}
                </p>
              </div>
              <div className="relative h-2 bg-slate-200 rounded-full">
                <div
                  className="absolute inset-y-0 bg-[#4A9FF5] rounded-full"
                  style={{
                    left: `${(listingPrefs.minBudget / 1000000) * 100}%`,
                    right: `${100 - (listingPrefs.maxBudget / 1000000) * 100}%`,
                  }}
                />
              </div>
              <div className="relative h-6 mt-1">
                <input
                  type="range"
                  min={0}
                  max={1000000}
                  step={5000}
                  value={listingPrefs.minBudget}
                  onChange={(e) => updateBudget('minBudget', e.target.value)}
                  aria-label={t('settings_min_budget')}
                  className="budget-range absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent cursor-pointer pointer-events-none"
                />
                <input
                  type="range"
                  min={0}
                  max={1000000}
                  step={5000}
                  value={listingPrefs.maxBudget}
                  onChange={(e) => updateBudget('maxBudget', e.target.value)}
                  aria-label={t('settings_max_budget')}
                  className="budget-range absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent cursor-pointer pointer-events-none"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Br 0</span>
                <span>Br 1M</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="preferredLocations">
                {t('settings_preferred_locations')}
              </label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="preferredLocations"
                  type="text"
                  value={listingPrefs.preferredLocations}
                  onChange={(e) => setListingPrefs((prev) => ({ ...prev, preferredLocations: e.target.value }))}
                  placeholder={t('settings_locations_placeholder')}
                  className={`${FIELD_STYLE} pl-10`}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                {t('settings_locations_hint')}
              </p>
            </div>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer hover:bg-slate-100/50 transition">
              <div>
                <p className="text-xs font-bold text-slate-800">{t('settings_listing_alerts')}</p>
                <p className="text-[11px] text-slate-500">
                  {t('settings_listing_alerts_sub')}
                </p>
              </div>
              <input
                type="checkbox"
                checked={listingPrefs.listingAlert}
                onChange={() => setListingPrefs((prev) => ({ ...prev, listingAlert: !prev.listingAlert }))}
                className="w-4 h-4 text-[#4A9FF5] rounded focus:ring-[#4A9FF5]"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
        <div className="flex items-center space-x-2 text-xs">
          {storageStatus === 'saved' ? (
            <>
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span className="text-emerald-700 font-semibold">{t('settings_saved_local')}</span>
            </>
          ) : (
            <>
              <AlertCircle size={15} className="text-rose-500" />
              <span className="text-slate-500">{t('settings_save_failed')}</span>
            </>
          )}
        </div>
      </div>

      {toastMessage && (
        <div
          className={`fixed bottom-16 right-6 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-medium ${
            toastTone === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'
          }`}
          role={toastTone === 'error' ? 'alert' : 'status'}
        >
          {toastTone === 'error' ? (
            <AlertCircle size={16} className="shrink-0" />
          ) : (
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Settings;
