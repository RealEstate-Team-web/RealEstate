import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getCurrentSubscription } from '../../services/subscription.service';
import { useAuth } from '../../hooks/useAuth';

const SubscriptionResult = () => {
  const { t } = useTranslation('agents');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get('status');

  const payerName =
    user?.firstName || user?.lastName || user?.name || user?.fullName
      ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.name || user?.fullName
      : '';

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    let active = true;
    let attempts = 0;
    const load = async () => {
      attempts += 1;
      try {
        const data = await getCurrentSubscription();
        if (!active) return;
        setCurrent(data);

        const sub = data?.subscription;
        const resolved =
          sub?.isActive ||
          sub?.status === 'failed' ||
          sub?.status === 'cancelled' ||
          attempts >= 10;
        if (resolved) {
          setLoading(false);
        } else {
          setTimeout(load, 4000);
        }
      } catch (error) {
        if (active) {
          setLoadError(error.message || t('result_load_error'));
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [t]);

  let state = 'failed';
  if (current?.subscription?.isActive) {
    state = 'success';
  } else if (current?.subscription?.status === 'pending' || statusParam === 'pending') {
    state = 'pending';
  } else if (current?.subscription?.status === 'active') {
    state = 'pending';
  }

  const Icon =
    state === 'success' ? CheckCircle2 : state === 'pending' ? Clock : XCircle;
  const titleKey =
    state === 'success'
      ? 'result_success_title'
      : state === 'pending'
        ? 'result_pending_title'
        : 'result_failed_title';
  const messageKey =
    state === 'success'
      ? 'result_success_message'
      : state === 'pending'
        ? 'result_pending_message'
        : 'result_failed_message';
  const iconClass =
    state === 'success'
      ? 'text-green-600'
      : state === 'pending'
        ? 'text-amber-500'
        : 'text-red-500';

  return (
    <div className="mx-auto max-w-lg space-y-6 font-sans">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 size={40} className="animate-spin text-[#0F9690]" />
            <p className="text-sm text-[#6B7280]">{t('result_loading')}</p>
          </div>
        ) : loadError ? (
          <div className="space-y-4 px-4 py-6">
            <XCircle size={44} className="mx-auto text-red-500" />
            <h2 className="text-lg font-bold text-[#111827]">{t('result_load_error')}</h2>
            <p className="text-[13px] text-[#6B7280]">{loadError}</p>
            <button
              type="button"
              onClick={() => navigate('/agent/subscription')}
              className="rounded-lg bg-[#0F9690] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0D827D]"
            >
              {t('result_back')}
            </button>
          </div>
        ) : (
          <div className="space-y-4 px-4 py-6">
            <Icon size={44} className={`mx-auto ${iconClass}`} />
            <h2 className="text-lg font-bold text-[#111827]">{t(titleKey)}</h2>
            <p className="text-[13px] text-[#6B7280]">{t(messageKey)}</p>

{current?.subscription?.plan ? (
                  <div className="mx-auto mt-2 max-w-xs rounded-lg bg-[#F3FAF9] px-4 py-3 text-left text-[13px] text-[#162831]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{current.subscription.plan.name}</span>
                      <span className="font-bold text-[#0F9690]">
                        {Number(current.subscription.amount || 0).toLocaleString()}{' '}
                        {current.subscription.currency}
                      </span>
                    </div>
                    {current.subscription.expiresAt ? (
                      <p className="mt-1 text-xs text-[#6B7280]">
                        {t('result_expires')}{' '}
                        {new Date(current.subscription.expiresAt).toLocaleString()}
                      </p>
                    ) : null}
                    {payerName ? (
                      <p className="mt-2 border-t border-[#E3EFEE] pt-2 text-xs text-[#6B7280]">
                        {t('result_payer')}{' '}
                        <span className="font-semibold text-[#162831]">{payerName}</span>
                      </p>
                    ) : null}
                    {user?.email ? (
                      <p className="mt-1 text-xs text-[#6B7280]">
                        {t('result_email')}{' '}
                        <span className="font-semibold text-[#162831]">{user.email}</span>
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-[#6B7280]">
                      {t('result_date')}{' '}
                      <span className="font-semibold text-[#162831]">
                        {current.subscription.startsAt
                          ? new Date(current.subscription.startsAt).toLocaleString()
                          : '—'}
                      </span>
                    </p>
                  </div>
                ) : null}

            <div className="flex items-center justify-center gap-3 pt-2">
              {state === 'failed' ? (
                <button
                  type="button"
                  onClick={() => navigate('/agent/subscription')}
                  className="rounded-lg bg-[#162831] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0B2635]"
                >
                  {t('result_retry')}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => navigate('/agent/subscription')}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-bold text-[#162831] transition hover:bg-slate-50"
              >
                {t('result_back')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionResult;