import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

import { getPublicAgents } from "../../services/agent.service";

const PublicAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadAgents = async () => {
      try {
        const { agents: agentList } = await getPublicAgents();
        if (active) setAgents(Array.isArray(agentList) ? agentList : []);
      } catch (err) {
        if (active) {
          console.error("Failed to load agents:", err);
          setError(err?.message || "Failed to load agents.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAgents();

    return () => {
      active = false;
    };
  }, []);

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
            Our Professionals
          </span>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Meet Our Trusted Agents
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
            Connect with experienced real estate professionals who understand
            the market and are ready to help you find the right property.
          </p>

          <Link
            to="/properties"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0F9690] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0D827D]"
          >
            Explore Properties
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>
      </section>


      {/* AGENTS */}

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10 lg:py-20">

        <div className="mx-auto w-full max-w-[1240px]">

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#0F9690]">
              Our Team
            </span>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#162831] sm:text-4xl">
              Meet Our Agents
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
              Our experienced agents are here to guide you through every step
              of your property journey.
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
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="h-[260px] animate-pulse bg-slate-100" />
                  <div className="space-y-2 p-5">
                    <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : agents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {agents.map((agent) => (

                <div
                  key={agent.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#0F9690]/30 hover:shadow-[0_15px_40px_rgba(15,150,144,0.12)]"
                >

                  {/* Agent Image */}

                  <div className="relative flex h-[260px] items-center justify-center overflow-hidden bg-slate-100">

                    {agent.photo ? (
                      <img
                        src={agent.photo}
                        alt={agent.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#E8F7F5] text-5xl font-extrabold text-[#0F9690]">
                        {agent.name?.charAt(0) || "A"}
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#162831] shadow">
                      {agent.propertyCount}{" "}
                      {agent.propertyCount === 1 ? "Property" : "Properties"}
                    </div>

                  </div>


                  {/* Agent Information */}

                  <div className="p-5">

                    <h3 className="text-lg font-bold text-[#162831]">
                      {agent.name}
                    </h3>

                    <p className="mt-1 text-xs font-medium text-[#0F9690]">
                      {agent.role}
                    </p>


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
                          Experience
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#162831]">
                          {agent.experienceYears != null
                            ? `${agent.experienceYears} ${agent.experienceYears === 1 ? "Year" : "Years"}`
                            : "—"}
                        </p>
                      </div>

                      {agent.email && (
                        <a
                          href={`mailto:${agent.email}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F9690] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0D827D]"
                        >
                          Contact
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>
          ) : !error ? (
            <p className="text-center text-sm text-slate-500">
              No agents are available yet.
            </p>
          ) : null}

        </div>

      </section>


      {/* BECOME AN AGENT*/}

      <section className="bg-[#F8FAFC] px-5 py-16 sm:px-8 lg:px-10">

        <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-7 text-center md:flex-row md:text-left">

          <div>

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#0F9690]">
              Join Our Team
            </span>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Ready to Grow Your Real Estate Career?
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Join our growing network of professional agents and connect with
              more clients looking for their next property.
            </p>

          </div>

          <Link
            to="/register"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#E69500] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D48800]"
          >
            Become an Agent
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

      </section>

    </div>
  );
};

export default PublicAgents;