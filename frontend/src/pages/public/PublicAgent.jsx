import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { getPublicAgents } from "../../services/agent.service";
import useAuth from "../../hooks/useAuth";
import AgentCard from "../../components/agent/AgentCard";
import AgentCardSkeleton from "../../components/agent/AgentCardSkeleton";
import { ContactAgentModal } from "../../components/buyer/ContactAgentModal";

const PublicAgents = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("agents");
  const { user } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Restore a pending "contact agent" request (stashed before the guest walked
  // through login) so the modal auto-opens once the guest arrives as a buyer.
  // Only an authenticated buyer gets the request restored — guests keep null.
  const [contactAgent, setContactAgent] = useState(null);

  useEffect(() => {
    if (!user) return;

    const raw = sessionStorage.getItem("pendingAgentContact");
    if (!raw) return;

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem("pendingAgentContact");
      return;
    }

    if (data?.agentId) {
      Promise.resolve().then(() => {
        setContactAgent({ id: data.agentId, name: data.name, photo: data.photo || null });
      });
    }
    sessionStorage.removeItem("pendingAgentContact");
  }, [user]);

  useEffect(() => {
    let active = true;

    const loadAgents = async () => {
      try {
        const { agents: agentList } = await getPublicAgents();
        if (active) setAgents(Array.isArray(agentList) ? agentList : []);
      } catch (err) {
        if (active) {
          console.error("Failed to load agents:", err);
          setError(t("load_error"));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAgents();

    return () => {
      active = false;
    };
  }, [t]);

  const handleContact = (agent) => {
    if (user) {
      setContactAgent(agent);
      return;
    }

    sessionStorage.setItem(
      "pendingAgentContact",
      JSON.stringify({
        agentId: agent.id,
        name: agent.name,
        photo: agent.photo || null,
      })
    );
    sessionStorage.setItem("returnTo", "/agents");
    navigate("/login");
  };

  const handleCloseContactModal = () => {
    setContactAgent(null);
  };

  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-white">

      {/* HERO */}

      <section
        className="relative flex min-h-[480px] items-center justify-center bg-cover bg-center px-5 sm:px-8"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,35,44,.68),rgba(16,35,44,.68)),url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=90')",
        }}
      >
        <div className="mx-auto w-full max-w-[900px] py-20 text-center">

          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
            {t("hero_badge")}
          </span>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            {t("hero_title")}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
            {t("hero_subtitle")}
          </p>

          <Link
            to="/properties"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0F9690] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0D827D]"
          >
            {t("explore_properties")}
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>
      </section>


      {/* AGENTS */}

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10 lg:py-20">

        <div className="mx-auto w-full max-w-[1240px]">

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#0F9690]">
              {t("list_eyebrow")}
            </span>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#162831] sm:text-4xl">
              {t("list_title")}
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
              {t("list_subtitle")}
            </p>

          </div>


          {error && (
            <p className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </p>
          )}


          {/* Agent Cards */}

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <AgentCardSkeleton key={item} variant="full" />
              ))}
            </div>
          ) : agents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  variant="full"
                  onContact={handleContact}
                />
              ))}
            </div>
          ) : !error ? (
            <p className="text-center text-sm text-slate-500">
              {t("empty")}
            </p>
          ) : null}

        </div>

      </section>


      {/* BECOME AN AGENT*/}

      <section className="bg-[#F8FAFC] px-5 py-16 sm:px-8 lg:px-10">

        <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-7 text-center md:flex-row md:text-left">

          <div>

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#0F9690]">
              {t("join_eyebrow")}
            </span>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              {t("join_title")}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
              {t("join_subtitle")}
            </p>

          </div>

          <Link
            to="/register"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#E69500] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D48800]"
          >
            {t("become_agent")}
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

      </section>

      <ContactAgentModal
        open={Boolean(contactAgent)}
        agent={contactAgent}
        onClose={handleCloseContactModal}
      />

    </div>
  );
};

export default PublicAgents;