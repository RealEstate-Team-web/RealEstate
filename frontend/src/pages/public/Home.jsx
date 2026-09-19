import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { ROUTES } from "../../utils/constants";
import { getLanding } from "../../services/property.service";
import { getPublicAgents } from "../../services/agent.service";
import PropertyCard from "../../components/property/PropertyCard";
import AgentCard from "../../components/agent/AgentCard";
import AgentCardSkeleton from "../../components/agent/AgentCardSkeleton";
import SubscriptionPlans from "../../components/subscription/SubscriptionPlans";



const Home = () => {
  const { t } = useTranslation("landing");
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState("");
  const [agents, setAgents] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [agentsError, setAgentsError] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");

  const navigate = useNavigate();

  const handlePlanSelect = () => {
    navigate("/register");
  };

 useEffect(() => {
  const load = async () => {
    try {
      const response = await getLanding();
      const data = response?.data || response;

      if (data?.properties?.length) {
        setProperties(data.properties);
        setPropertiesError("");
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Landing error:", error);
      setProperties([]);
      setPropertiesError(t("search_loading_properties_error"));
    } finally {
      setPropertiesLoading(false);
    }
  };

  load();

}, [t]);

 useEffect(() => {
  const loadAgents = async () => {
    try {
      const { agents: agentList } = await getPublicAgents(5);
      setAgents(Array.isArray(agentList) ? agentList : []);
      setAgentsError("");
    } catch (error) {
      console.error("Agents error:", error);
      setAgents([]);
      setAgentsError(t("search_loading_agents_error"));
    } finally {
      setAgentsLoading(false);
    }
  };

  loadAgents();

}, [t]);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (location) {
      params.set("city", location);
    }

    if (type) {
      params.set("categoryId", type);
    }

    if (price) {
      params.set("maxPrice", price);
    }

    navigate(`/properties?${params.toString()}`);
  };

  const displayedProperties = properties;

  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-white">

      {/* HERO*/}

      <section
        className="relative flex min-h-[540px] items-center justify-center bg-cover bg-center px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,35,44,.58),rgba(16,35,44,.58)),url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1800&q=90')",
        }}
      >
        <div className="w-full max-w-[1050px] text-center py-16">

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            {t("hero_title")}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-100 sm:text-base">
            {t("hero_subtitle")}
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-9 grid max-w-[900px] grid-cols-1 gap-2 rounded-xl bg-inherit p-2.5 shadow-2xl sm:grid-cols-2 lg:grid-cols-4"
          >

            <input
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder={t("hero_placeholder")}
              className="h-12 rounded-lg bg-white border border-slate-200 px-4 text-sm outline-none focus:border-[#0F9690]"
            />

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="h-12 rounded-lg bg-white border border-slate-200 px-4 text-sm text-slate-600 outline-none focus:border-[#0F9690]"
            >
              <option value="">{t("option_type")}</option>
              <option value="1">{t("option_apartment")}</option>
              <option value="2">{t("option_villa")}</option>
              <option value="3">{t("option_house")}</option>
              <option value="4">{t("option_commercial")}</option>
            </select>

            <select
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              className="h-12 rounded-lg bg-white border border-slate-200 px-4 text-sm text-slate-600 outline-none focus:border-[#0F9690]"
            >
              <option value="">{t("option_price")}</option>
              <option value="500000">Up to 500,000</option>
              <option value="1000000">Up to 1,000,000</option>
              <option value="2000000">Up to 2,000,000</option>
              <option value="5000000">Up to 5,000,000</option>
            </select>

            <button
              type="submit"
              className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0F9690] px-5 text-sm font-bold text-white transition hover:bg-[#0D827D] cursor-pointer"
            >
              <Search className="h-4 w-4" />
              {t("search_properties")}
            </button>

          </form>
        </div>
      </section>

      {/* FEATURED PROPERTIES*/}

      <section className="w-full bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

        {/* Main centered container */}
        <div className="mx-auto w-full max-w-[1240px]">

          {/*FEATURED HEADER*/}
          <div className="mb-10 flex flex-col items-center text-center">

            <span className="mb-3 inline-flex rounded-full border border-[#0F9690]/20 bg-[#0F9690]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F9690]">
              {t("featured_badge")}
            </span>

            <h2 className="text-2xl font-bold tracking-tight text-[#162831] sm:text-3xl lg:text-4xl">
              {t("featured_title")}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              {t("featured_subtitle")}
            </p>
          </div>

          {/*PROPERTY CARDS*/}

          <div className="flex w-full justify-center">

            {propertiesLoading ? (
              <div className="grid w-full grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="w-full max-w-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <div className="h-[200px] animate-pulse bg-slate-100" />
                    <div className="space-y-2 p-4">
                      <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : propertiesError ? (
              <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-rose-50 px-5 py-10 text-center text-sm text-rose-700">
                {propertiesError}
              </div>
            ) : displayedProperties.length === 0 ? (
              <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
                {t("featured_empty")}
              </div>
            ) : (
              <div className="grid w-full grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {displayedProperties.map((property) => (
                  <div
                    key={property.id}
                    className="w-full max-w-[300px]"
                  >
                    <div className="h-full rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_35px_rgba(15,150,144,0.15)]">
                      <PropertyCard property={property} />
                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>

          {/*VIEW ALL*/}
          <div className="mt-12 flex justify-center">

            <Link
              to="/properties"
              className="group inline-flex items-center gap-2 rounded-xl border border-[#0F9690] px-6 py-3 text-sm font-bold text-[#0F9690] transition-all duration-300 hover:bg-[#0F9690] hover:text-white hover:shadow-[0_10px_30px_rgba(15,150,144,0.25)] focus:outline-none focus:ring-2 focus:ring-[#0F9690]/30 focus:ring-offset-2"
            >
              {t("view_all")}

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </div>

        </div>
      </section>

      {/*  FEATURED AGENTS SECTION */}
      <section id="agents" className="w-full border-t border-slate-200 bg-[#F8FAFC]">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F9690]">
            {t("agents_eyebrow")}
          </span>

          <h2 className="mb-7 mt-1 text-2xl font-bold text-[#162831] sm:text-3xl">
            {t("agents_title")}
          </h2>

          {agentsLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {[1, 2, 3, 4, 5].map((item) => (
                <AgentCardSkeleton key={item} variant="compact" />
              ))}
            </div>
          ) : agents.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} variant="compact" />
              ))}
            </div>
          ) : agentsError ? (
            <p className="text-sm text-slate-500">{agentsError}</p>
          ) : (
            <p className="text-sm text-slate-500">
              {t("agents_empty")}
            </p>
          )}

          <div className="mt-8">
            <Link
              to={ROUTES.registerAgent}
              className="inline-flex items-center gap-2 rounded-lg bg-[#E69500] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#D48800]"
            >
              {t("become_agent")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* SUBSCRIPTION PLANS */}
      <section id="pricing" className="w-full border-t border-slate-200 bg-[#F8FAFC]">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F9690]">
            {t("pricing_eyebrow")}
          </span>

          <h2 className="mb-3 mt-1 text-2xl font-bold text-[#162831] sm:text-3xl">
            {t("pricing_title")}
          </h2>

          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-slate-500">
            {t("pricing_subtitle")}
          </p>

          <SubscriptionPlans ctaLabel={t("pricing_cta")} onCta={handlePlanSelect} />

        </div>
      </section>

    </div>
  );
};

export default Home;