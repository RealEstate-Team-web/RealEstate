import { Check, Building2, Images } from 'lucide-react';

const SubscriptionPlanFeatures = ({ features }) => {
  if (!features || features.length === 0) {
    return (
      <p className="text-xs text-slate-400">No features listed.</p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2 text-[13px] text-slate-600">
          <Check size={16} className="mt-0.5 shrink-0 text-[#0F9690]" strokeWidth={3} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
};

const SubscriptionPlanCard = ({
  plan,
  featured = false,
  ctaLabel = 'Choose Plan',
  onCta,
  ctaDisabled = false,
  ctaTitle,
}) => {
  const price = Number(plan.price || 0).toLocaleString();
  const durationLabel =
    plan.duration_days === 30
      ? 'month'
      : plan.duration_days === 1
        ? 'day'
        : `${plan.duration_days} days`;

  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 transition-shadow duration-200 ${
        featured
          ? 'border-[#0F9690]/40 shadow-[0_10px_35px_rgba(15,150,144,0.18)]'
          : 'border-slate-200 shadow-sm hover:shadow-md'
      }`}
    >
      {featured ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0F9690] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
          Most Popular
        </span>
      ) : null}

      <h3 className="text-lg font-bold text-[#162831]">{plan.name}</h3>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold tracking-tight text-[#162831]">
          {price}
        </span>
        <span className="text-sm font-semibold text-[#0F9690]">{plan.currency}</span>
        <span className="text-xs text-slate-400">/ {durationLabel}</span>
      </div>

      {plan.description ? (
        <p className="mt-3 text-[13px] leading-relaxed text-slate-500">{plan.description}</p>
      ) : null}

      {plan.property_limit != null ? (
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-[#F3FAF9] px-3 py-2 text-[12px] font-semibold text-[#162831]">
          <span className="inline-flex items-center gap-1.5">
            <Building2 size={15} className="text-[#0F9690]" />
            {plan.property_limit} {plan.property_limit === 1 ? 'property' : 'properties'}
          </span>
          {plan.images_per_property != null ? (
            <span className="inline-flex items-center gap-1.5">
              <Images size={15} className="text-[#0F9690]" />
              {plan.images_per_property} {plan.images_per_property === 1 ? 'image' : 'images'} each
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 flex-1 border-t border-slate-100 pt-5">
        <SubscriptionPlanFeatures features={plan.features} />
      </div>

      <button
        type="button"
        onClick={() => {
          if (!ctaDisabled && onCta) onCta(plan);
        }}
        disabled={ctaDisabled}
        title={ctaDisabled ? ctaTitle || 'Payment integration is coming soon' : undefined}
        aria-disabled={ctaDisabled || undefined}
        className={`mt-6 inline-flex h-[42px] w-full items-center justify-center rounded-lg text-[13px] font-bold transition ${
          ctaDisabled
            ? 'cursor-not-allowed bg-slate-100 text-slate-400 shadow-none'
            : `${featured ? 'bg-[#0F9690] text-white shadow-sm hover:bg-[#0D827D]' : 'bg-[#162831] text-white hover:bg-[#0B2635]'}`
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
};

export { SubscriptionPlanFeatures };
export default SubscriptionPlanCard;