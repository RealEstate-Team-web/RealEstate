import { CreditCard } from 'lucide-react';
import SubscriptionPlans from '../../components/subscription/SubscriptionPlans';

const AgentSubscription = () => {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-start gap-4 flex-wrap">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D6FD3] mb-1">
            Subscription
          </p>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="w-10 h-10 rounded-xl bg-[#E7F0FB] text-[#4A9FF5] flex items-center justify-center shrink-0"
            >
              <CreditCard size={20} />
            </span>
            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
              Choose a Plan
            </h1>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-1">
            Select a subscription plan to start publishing your properties.
            Online payment is coming soon.
          </p>
        </div>
      </div>

      <div
        role="note"
        className="rounded-md bg-[#E7F0FB] text-[#1F5FA8] text-[13px] px-4 py-3"
      >
        Payment integration is not available yet. Plan selection will be enabled
        once online payment is launched.
      </div>

      <SubscriptionPlans
        ctaLabel="Payment Coming Soon"
        ctaDisabled
        ctaTitle="Online payment is coming soon"
      />
    </div>
  );
};

export default AgentSubscription;