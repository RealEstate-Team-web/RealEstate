import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SubscriptionPlanCard from './SubscriptionPlanCard';
import { getSubscriptionPlans } from '../../services/subscriptionPlan.service';

const OrderClasses = ['lg:order-1', 'lg:order-2', 'lg:order-3'];

const PlanSkeleton = () => (
  <div className="h-full animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
    <div className="h-4 w-24 rounded bg-slate-100" />
    <div className="mt-4 h-9 w-32 rounded bg-slate-100" />
    <div className="mt-4 h-3 w-full rounded bg-slate-100" />
    <div className="mt-2 h-3 w-3/4 rounded bg-slate-100" />
    <div className="mt-6 h-24 rounded bg-slate-50" />
    <div className="mt-6 h-[42px] w-full rounded-lg bg-slate-100" />
  </div>
);

const SubscriptionPlans = ({
  ctaLabel,
  onCta,
  ctaDisabled = false,
  ctaTitle,
}) => {
  const { t } = useTranslation('subscription');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = async (isMounted = () => true) => {
    if (isMounted) setLoading(true);
    if (isMounted) setError(null);
    try {
      const data = await getSubscriptionPlans();
      if (isMounted && Array.isArray(data)) setPlans(data);
      else if (isMounted) setPlans([]);
    } catch {
      if (isMounted) setError(t('load_error'));
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSubscriptionPlans();
        if (active) {
          setPlans(Array.isArray(data) ? data : []);
        }
      } catch {
        if (active) setError(t('load_error'));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [t]);

  if (loading) {
    return (
      <div role="status" aria-label={t('loading_aria')} className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {[1, 2, 3].map((item) => (
          <PlanSkeleton key={item} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
        <p role="alert" className="text-[13px] text-slate-500">
          {error}
        </p>
        <button
          type="button"
          onClick={() => fetchPlans()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F9690] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0D827D]"
        >
          <RefreshCw size={14} />
          {t('retry')}
        </button>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
        {t('empty')}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {plans.map((plan, index) => {
        const featured = plan.slug === 'pro';
        return (
          <div key={plan.id} className={`h-full ${OrderClasses[index % OrderClasses.length]}`}>
            <SubscriptionPlanCard
              plan={plan}
              featured={featured}
              ctaLabel={ctaLabel}
              onCta={onCta}
              ctaDisabled={ctaDisabled}
              ctaTitle={ctaTitle}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SubscriptionPlans;