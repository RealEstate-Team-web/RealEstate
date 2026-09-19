import { ArrowRight, MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AgentCard = ({ agent, variant = 'full', onContact }) => {
  const { t } = useTranslation('agents');

  if (variant === 'compact') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
        {agent.photo ? (
          <img
            src={agent.photo}
            alt={agent.name}
            className="mx-auto h-16 w-16 rounded-full border-2 border-[#0F9690] object-cover p-0.5"
          />
        ) : (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#0F9690] bg-[#F3FAF9] p-0.5 text-lg font-extrabold text-[#0F9690]">
            {agent.name?.charAt(0) || 'A'}
          </div>
        )}

        <h4 className="mt-2 line-clamp-1 text-xs font-bold text-[#162831]">
          {agent.name}
        </h4>

        <p className="mt-1 text-[10px] text-slate-500">{agent.role}</p>

        <p className="mt-1 text-[10px] font-semibold text-[#0F9690]">
          {t('propertyCount', {
            count: agent.propertyCount ?? 0,
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#0F9690]/30 hover:shadow-[0_15px_40px_rgba(15,150,144,0.12)]">
      <div className="relative flex h-[260px] items-center justify-center overflow-hidden bg-slate-100">
        {agent.photo ? (
          <img
            src={agent.photo}
            alt={agent.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#E8F7F5] text-5xl font-extrabold text-[#0F9690]">
            {agent.name?.charAt(0) || 'A'}
          </div>
        )}

        <div className="absolute bottom-3 left-3 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#162831] shadow">
          {t('propertyCount', {
            count: agent.propertyCount ?? 0,
          })}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-[#162831]">{agent.name}</h3>

        <p className="mt-1 text-xs font-medium text-[#0F9690]">{agent.role}</p>

        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
          {agent.location ? (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="h-4 w-4 text-[#0F9690]" />
              {agent.location}
            </div>
          ) : null}

          {agent.phone ? (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Phone className="h-4 w-4 text-[#0F9690]" />
              {agent.phone}
            </div>
          ) : null}

          {agent.email ? (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Mail className="h-4 w-4 text-[#0F9690]" />
              {agent.email}
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              {t('experience')}
            </p>

            <p className="mt-1 text-sm font-bold text-[#162831]">
              {agent.experienceYears != null
                ? t('year', {
                    count: agent.experienceYears,
                  })
                : '—'}
            </p>
          </div>

          {agent.email &&
            (onContact ? (
              <button
                type="button"
                onClick={() => onContact(agent)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F9690] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0D827D] cursor-pointer"
              >
                {t('contact')}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <a
                href={`mailto:${agent.email}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F9690] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0D827D]"
              >
                {t('contact')}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AgentCard;