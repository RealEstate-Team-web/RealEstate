import { Link } from "react-router-dom";
import {
  Star,
  Quote,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const AGENTS = [
  {
    id: 1,
    name: "Abebe Bekele",
    role: "Senior Real Estate Agent",
    location: "Bole, Addis Ababa",
    phone: "+251 911 234 567",
    email: "abebe@dreamhome.com",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85",
    rating: 5,
    properties: 42,
    experience: "8 Years",
  },
  {
    id: 2,
    name: "Sara Tefera",
    role: "Luxury Property Specialist",
    location: "Old Airport, Addis Ababa",
    phone: "+251 922 345 678",
    email: "sara@dreamhome.com",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85",
    rating: 5,
    properties: 35,
    experience: "7 Years",
  },
  {
    id: 3,
    name: "Dawit Haile",
    role: "Commercial Property Agent",
    location: "Kazanchis, Addis Ababa",
    phone: "+251 933 456 789",
    email: "dawit@dreamhome.com",
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=85",
    rating: 5,
    properties: 28,
    experience: "6 Years",
  },
  {
    id: 4,
    name: "Selamawit Tadesse",
    role: "Residential Property Expert",
    location: "CMC, Addis Ababa",
    phone: "+251 944 567 890",
    email: "selamawit@dreamhome.com",
    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=85",
    rating: 5,
    properties: 31,
    experience: "5 Years",
  },
  {
    id: 5,
    name: "Yonas Mekonnen",
    role: "Property Investment Advisor",
    location: "Mexico Square, Addis Ababa",
    phone: "+251 955 678 901",
    email: "yonas@dreamhome.com",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=85",
    rating: 5,
    properties: 26,
    experience: "5 Years",
  },
  {
    id: 6,
    name: "Marta Girma",
    role: "Residential Agent",
    location: "Summit, Addis Ababa",
    phone: "+251 966 789 012",
    email: "marta@dreamhome.com",
    photo:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&q=85",
    rating: 5,
    properties: 24,
    experience: "4 Years",
  },
];

const TESTIMONIALS = [
  {
    text: "The team made finding our dream home simple and completely stress-free. Our agent understood exactly what we were looking for.",
    author: "Daniel Kassahun",
    role: "Homeowner",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
  },
  {
    text: "I received professional advice from the first meeting until the final agreement. The entire experience was transparent and reliable.",
    author: "Hiwot Alemayehu",
    role: "Property Investor",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    text: "Our agent helped us compare several properties and find one that matched our budget and lifestyle perfectly.",
    author: "Michael Tesfaye",
    role: "Homeowner",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
];

const PublicAgents = () => {
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


          {/* Agent Cards */}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {AGENTS.map((agent) => (

              <div
                key={agent.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#0F9690]/30 hover:shadow-[0_15px_40px_rgba(15,150,144,0.12)]"
              >

                {/* Agent Image */}

                <div className="relative h-[260px] overflow-hidden bg-slate-100">

                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute bottom-3 left-3 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#162831] shadow">
                    {agent.properties} Properties
                  </div>

                </div>


                {/* Agent Information */}

                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h3 className="text-lg font-bold text-[#162831]">
                        {agent.name}
                      </h3>

                      <p className="mt-1 text-xs font-medium text-[#0F9690]">
                        {agent.role}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 rounded-lg bg-[#FFF7E8] px-2 py-1">
                      <Star className="h-3.5 w-3.5 fill-[#E6A23C] text-[#E6A23C]" />
                      <span className="text-xs font-bold text-[#162831]">
                        {agent.rating}.0
                      </span>
                    </div>

                  </div>


                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="h-4 w-4 text-[#0F9690]" />
                      {agent.location}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Phone className="h-4 w-4 text-[#0F9690]" />
                      {agent.phone}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail className="h-4 w-4 text-[#0F9690]" />
                      {agent.email}
                    </div>

                  </div>


                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        Experience
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#162831]">
                        {agent.experience}
                      </p>
                    </div>

                    <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F9690] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0D827D]">
                      View Profile
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/*TESTIMONIALS */}

      <section className="border-y border-slate-200 bg-[#F8FAFC] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">

        <div className="mx-auto w-full max-w-[1240px]">

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#0F9690]">
              Client Stories
            </span>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#162831] sm:text-4xl">
              What Our Clients Say
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
              Real experiences from people who trusted our agents with their
              property journey.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {TESTIMONIALS.map((testimonial) => (

              <div
                key={testimonial.author}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >

                <Quote className="absolute right-6 top-6 h-10 w-10 text-[#0F9690]/10" />

                <div className="flex items-center gap-3">

                  <img
                    src={testimonial.photo}
                    alt={testimonial.author}
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="text-sm font-bold text-[#162831]">
                      {testimonial.author}
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {testimonial.role}
                    </p>
                  </div>

                </div>


                <div className="mt-5 flex gap-1">

                  {[1, 2, 3, 4, 5].map((star) => (

                    <Star
                      key={star}
                      className="h-3.5 w-3.5 fill-[#E6A23C] text-[#E6A23C]"
                    />

                  ))}

                </div>


                <p className="mt-4 text-sm leading-7 text-slate-600">
                  "{testimonial.text}"
                </p>

              </div>

            ))}

          </div>

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