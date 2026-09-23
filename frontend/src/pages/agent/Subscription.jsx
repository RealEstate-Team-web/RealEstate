import { CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SubscriptionPlans from '../../components/subscription/SubscriptionPlans';

const AgentSubscription = () => {
  const { t } = useTranslation('agents');
  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-start gap-4 flex-wrap">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D6FD3] mb-1">
            {t('subscription_title')}
          </p>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="w-10 h-10 rounded-xl bg-[#E7F0FB] text-[#4A9FF5] flex items-center justify-center shrink-0"
            >
              <CreditCard size={20} />
            </span>
            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
              {t('subscription_choose_plan')}
            </h1>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-1">
            {t('subscription_choose_plan_sub')}
          </p>
        </div>
      </div>

      <div
        role="note"
        className="rounded-md bg-[#E7F0FB] text-[#1F5FA8] text-[13px] px-4 py-3"
      >
        {t('subscription_payment_note')}
      </div>

      <SubscriptionPlans
        ctaLabel={t('subscription_coming_soon')}
        ctaDisabled
        ctaTitle={t('subscription_coming_soon_title')}
      />
    </div>
  );
};

export default AgentSubscription;