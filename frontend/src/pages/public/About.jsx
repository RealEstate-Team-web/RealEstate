import {
  Eye,
  Handshake,
  ShieldCheck,
  Star,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const VALUES = [
  {
    icon: Eye,
    title: "Transparency",
    desc: "Clear property information with verified details helps you make confident, informed decisions.",
  },
  {
    icon: Handshake,
    title: "Convenience",
    desc: "Search, compare and connect with agents — all from one modern platform.",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    desc: "Every listing is backed by professional agents with proven track records.",
  },
  {
    icon: Star,
    title: "Excellence",
    desc: "We strive to provide the best property search experience in Ethiopia.",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Connecting buyers, renters, sellers and agents in one vibrant ecosystem.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    desc: "Helping you make smart property investment decisions for a better future.",
  },
];

const TEAM_STATS = [
  { value: "2,400+", label: "Properties Listed" },
  { value: "890+", label: "Happy Clients" },
  { value: "120+", label: "Expert Agents" },
  { value: "2018", label: "Year Founded" },
];

const About = () => {
  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-[#F7F9FA]">

      {/* HERO*/}
      <section className="relative isolate min-h-[380px] w-full overflow-hidden sm:min-h-[430px] lg:min-h-[470px]">

        {/* Background */}
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(8,25,34,0.93), rgba(8,25,34,0.68), rgba(8,25,34,0.80)), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85')",
          }}
        />

        {/* Glow */}
        <div className="pointer-events-none absolute left-[10%] top-1/4 h-60 w-60 rounded-full bg-[#0F9690]/15 blur-[110px] sm:h-80 sm:w-80" />

        <div className="pointer-events-none absolute right-[8%] top-1/3 h-48 w-48 rounded-full bg-[#20B5AE]/10 blur-[90px] sm:h-64 sm:w-64" />

        {/* Hero Content */}
        <div className="relative mx-auto flex min-h-[380px] w-full max-w-[1240px] items-center px-4 sm:px-6 lg:px-8 py-20 sm:min-h-[430px] sm:py-24 lg:min-h-[470px]">

          <div className="w-full max-w-[760px] animate-[fadeUp_.7s_ease-out_both]">

            <div className="mb-4 flex items-center gap-2.5">

              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2AC3BB] shadow-[0_0_13px_rgba(42,195,187,0.9)]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#54D4CD] sm:text-[10px]">
                About Us
              </span>

            </div>

            <h1
              className="text-[36px] font-bold leading-[1.05] tracking-tight text-white min-[480px]:text-[42px] sm:text-[50px] lg:text-[60px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              About Dream Home
              <span className="block text-[#25B8B1]">
                Estates.
              </span>
            </h1>

            <p className="mt-5 max-w-[600px] text-[13px] leading-6 text-[#C5D3D9] sm:text-[15px] sm:leading-7">
              Making property search simple, transparent and convenient
              for everyone.
            </p>

          </div>
        </div>

        {/* Bottom Fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#F7F9FA] to-transparent" />

      </section>


      {/* WHO WE ARE */}
      <section className="relative w-full overflow-hidden bg-white px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">

        {/* Background glow */}
        <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#0F9690]/5 blur-[120px]" />

        <div className="relative mx-auto w-full max-w-[1240px]">

          <div className="grid grid-cols-1 items-center gap-10 md:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 xl:gap-20">

            {/* IMAGE*/}
            <div className="relative min-w-0 animate-[fadeUp_.7s_ease-out_both]">

              {/* Image Glow */}
              <div className="pointer-events-none absolute -inset-3 rounded-[24px] bg-[#0F9690]/7 blur-2xl" />

              <div className="relative overflow-hidden rounded-2xl border border-[#E0E8EA] bg-[#EEF3F4] shadow-[0_15px_40px_rgba(16,42,52,0.10)]">

                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
                  alt="Modern luxury home interior"
                  className="h-[300px] w-full object-cover transition-transform duration-700 hover:scale-[1.035] sm:h-[380px] md:h-[430px] lg:h-[500px]"
                />

                {/* Image overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#102A35]/25 via-transparent to-transparent" />

              </div>


              {/* Floating badge */}
              <div className="absolute -bottom-5 right-4 hidden rounded-xl border border-white/10 bg-[#0F9690] px-5 py-3.5 text-white shadow-[0_10px_30px_rgba(15,150,144,0.25)] sm:block md:right-5 md:px-6 md:py-4">

                <p
                  className="text-[25px] font-bold leading-none md:text-[28px]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  8+
                </p>

                <p className="mt-1 text-[10px] font-medium text-[#C9F2EF] md:text-[11px]">
                  Years of Excellence
                </p>

              </div>

            </div>


            {/* CONTENT*/}
            <div className="min-w-0 animate-[fadeUp_.7s_.12s_ease-out_both]">

              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#0F9690] sm:text-[10px]">
                Who We Are
              </span>

              <h2
                className="mt-3 max-w-[580px] text-[29px] font-bold leading-[1.14] tracking-tight text-[#162831] sm:text-[34px] lg:text-[40px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Your Journey to the Right Home Starts Here.
              </h2>

              <p className="mt-4 max-w-[580px] text-[13px] leading-6 text-[#71818A] sm:text-[14px] sm:leading-7">
                Dream Home Estates is a real estate platform designed to
                make finding properties easier for buyers, renters and
                property seekers across Ethiopia and beyond.
              </p>

              <p className="mt-3 max-w-[580px] text-[13px] leading-6 text-[#71818A] sm:text-[14px] sm:leading-7">
                We bring property listings and real estate professionals
                together in one modern, convenient platform — giving you
                access to verified listings with the tools to find exactly
                what you need.
              </p>


              {/* STATS*/}
              <div className="mt-7 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3">

                {TEAM_STATS.map(({ value, label }, index) => (
                  <div
                    key={label}
                    className="group rounded-xl border border-[#E1E9EC] bg-[#F8FAFA] p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#0F9690]/30 hover:bg-white hover:shadow-[0_10px_25px_rgba(15,150,144,0.08)] sm:p-4"
                    style={{
                      animation: `fadeUp .6s ${
                        0.2 + index * 0.08
                      }s ease-out both`,
                    }}
                  >

                    <p
                      className="text-[22px] font-bold leading-none text-[#0F9690] sm:text-[25px]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {value}
                    </p>

                    <p className="mt-1.5 text-[10px] text-[#71818A] sm:text-[11px]">
                      {label}
                    </p>

                  </div>
                ))}

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* VALUES*/}
      <section className="relative w-full overflow-hidden bg-[#F7F9FA] px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">

        {/* Glows */}
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#0F9690]/5 blur-[120px]" />

        <div className="pointer-events-none absolute left-0 bottom-0 h-72 w-72 rounded-full bg-[#0F9690]/4 blur-[110px]" />

        <div className="relative mx-auto w-full max-w-[1240px]">

          {/* Heading */}
          <div className="mx-auto mb-9 max-w-[620px] text-center sm:mb-12">

            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#0F9690] sm:text-[10px]">
              Our Values
            </span>

            <h2
              className="mt-3 text-[29px] font-bold leading-tight tracking-tight text-[#162831] sm:text-[35px] lg:text-[42px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Built Around You.
            </h2>

            <p className="mt-3 text-[12px] leading-5 text-[#71818A] sm:text-[13px] sm:leading-6">
              Everything we do is centered around creating a better,
              simpler and more trustworthy property experience.
            </p>

          </div>


          {/* Values Grid */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">

            {VALUES.map(({ icon: Icon, title, desc }, index) => (
              <div
                key={title}
                className="group relative min-w-0 overflow-hidden rounded-xl border border-[#E0E8EA] bg-white p-5 shadow-[0_4px_18px_rgba(20,40,50,0.025)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0F9690]/25 hover:shadow-[0_14px_35px_rgba(15,150,144,0.09)] sm:p-6 lg:p-7"
                style={{
                  animation: `fadeUp .65s ${
                    index * 0.07
                  }s ease-out both`,
                }}
              >

                {/* Card Glow */}
                <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-[#0F9690]/0 blur-2xl transition-all duration-300 group-hover:bg-[#0F9690]/10" />


                {/* Icon */}
                <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F9690]/10 text-[#0F9690] transition-all duration-300 group-hover:bg-[#0F9690] group-hover:text-white group-hover:shadow-[0_0_20px_rgba(15,150,144,0.25)] sm:h-11 sm:w-11">

                  <Icon
                    size={18}
                    strokeWidth={1.8}
                  />

                </div>


                <h3 className="relative mt-4 text-[15px] font-semibold text-[#162831] sm:text-[16px]">
                  {title}
                </h3>

                <p className="relative mt-2 text-[12px] leading-5 text-[#71818A] sm:text-[13px] sm:leading-6">
                  {desc}
                </p>


                {/* Small arrow */}
                <div className="mt-4 flex items-center gap-1 text-[10px] font-semibold text-[#0F9690] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  Learn more
                  <ArrowRight size={12} />
                </div>

              </div>
            ))}

          </div>

        </div>
      </section>


      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }
        `}
      </style>

    </div>
  );
};

export default About;