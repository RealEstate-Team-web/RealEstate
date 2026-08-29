import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  Quote,
  ArrowRight,
} from "lucide-react";

import { getLanding } from "../../services/property.service";
import PropertyCard from "../../components/property/PropertyCard";
import {DEMO_PROPERTIES,AGENTS,TESTIMONIALS} from "../../utils/property.details.mock.data.js";



const Home = () => {
  const [properties, setProperties] = useState([]);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");

  const navigate = useNavigate();

 useEffect(() => {
  const load = async () => {
    try {
      const response = await getLanding();
      const data = response?.data || response;

      if (data?.properties?.length) {
        setProperties(data.properties);
      } else {
        setProperties(DEMO_PROPERTIES);
      }
    } catch (error) {
      console.error("Landing error:", error);
      setProperties(DEMO_PROPERTIES);
    }
  };

  load();

}, []);

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

  const displayedProperties =
    properties.length > 0
      ? properties
      : DEMO_PROPERTIES;

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
            Find Your Dream Property
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-100 sm:text-base">
            Find villas, townhouses, apartments and more matching your lifestyle.
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
              placeholder="Search by city or area..."
              className="h-12 rounded-lg bg-white border border-slate-200 px-4 text-sm outline-none focus:border-[#0F9690]"
            />

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="h-12 rounded-lg bg-white border border-slate-200 px-4 text-sm text-slate-600 outline-none focus:border-[#0F9690]"
            >
              <option value="">Type</option>
              <option value="1">Apartment</option>
              <option value="2">Villa</option>
              <option value="3">House</option>
              <option value="4">Commercial</option>
            </select>

            <select
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              className="h-12 rounded-lg bg-white border border-slate-200 px-4 text-sm text-slate-600 outline-none focus:border-[#0F9690]"
            >
              <option value="">Price Range</option>
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
              Search Properties
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
              Featured Listings
            </span>

            <h2 className="text-2xl font-bold tracking-tight text-[#162831] sm:text-3xl lg:text-4xl">
              Featured Properties
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Explore handpicked premier listings from top verified agents.
            </p>
          </div>

          {/*PROPERTY CARDS*/}

          <div className="flex w-full justify-center">

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
          </div>

          {/*VIEW ALL*/}
          <div className="mt-12 flex justify-center">

            <Link
              to="/properties"
              className="group inline-flex items-center gap-2 rounded-xl border border-[#0F9690] px-6 py-3 text-sm font-bold text-[#0F9690] transition-all duration-300 hover:bg-[#0F9690] hover:text-white hover:shadow-[0_10px_30px_rgba(15,150,144,0.25)] focus:outline-none focus:ring-2 focus:ring-[#0F9690]/30 focus:ring-offset-2"
            >
              View All Properties

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </div>

        </div>
      </section>

      {/*  AGENTS & TESTIMONIALS SECTION */}
      <section id="agents" className="w-full border-t border-slate-200 bg-[#F8FAFC]">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">

          {/* Agents */}
          <div className="lg:col-span-7">

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F9690]">
              Our Team
            </span>

            <h2 className="mb-7 mt-1 text-2xl font-bold text-[#162831] sm:text-3xl">
              Featured Agents
            </h2>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">

              {AGENTS.map((agent) => (
                <div
                  key={agent.name}
                  className="rounded-xl border border-slate-200 bg-white p-3 text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
                >

                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="mx-auto h-16 w-16 rounded-full border-2 border-[#0F9690] object-cover p-0.5"
                  />

                  <h4 className="mt-2 line-clamp-1 text-xs font-bold text-[#162831]">
                    {agent.name}
                  </h4>

                  <div className="my-1 flex justify-center text-[#E6A23C]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-3 w-3 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-500">
                    {agent.role}
                  </p>

                </div>
              ))}

            </div>

            <div className="mt-8">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-[#E69500] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#D48800]"
              >
                Become an Agent
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>

          {/* Testimonials */}
          <div className="lg:col-span-5">

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F9690]">
              Reviews
            </span>

            <h2 className="mb-7 mt-1 text-2xl font-bold text-[#162831] sm:text-3xl">
              Testimonials
            </h2>

            <div className="space-y-4">

              {TESTIMONIALS.map((testimonial) => (
                <div
                  key={testimonial.author}
                  className="rounded-xl bg-[#0D827D] p-5 text-white shadow-sm transition hover:shadow-md"
                >

                  <Quote className="mb-2 h-5 w-5 opacity-40" />

                  <p className="text-xs leading-relaxed text-white/90">
                    "{testimonial.text}"
                  </p>

                  <div className="mt-3 border-t border-white/10 pt-2.5 flex items-center justify-between">
                    <p className="text-xs font-bold">
                      {testimonial.author}
                    </p>

                    <p className="text-[11px] text-white/70">
                      {testimonial.role}
                    </p>
                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;