import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Our Office",
    value: "Bole Road, Addis Ababa, Ethiopia",
  },
  {
    icon: Phone,
    label: "Phone Number",
    value: "+251 911 000 000",
    href: "tel:+251911000000",
  },
  {
    icon: Mail,
    label: "Email Address",
    value: "info@dreamhomeestates.com",
    href: "mailto:info@dreamhomeestates.com",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon – Sat: 8:00 AM – 6:00 PM",
  },
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    setForm({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-[#F7F9FA]">

      {/* HERO*/}
      <section className="relative isolate min-h-[380px] w-full overflow-hidden sm:min-h-[430px] lg:min-h-[470px]">

        {/* Background */}
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(8,25,34,0.94) 0%, rgba(8,25,34,0.72) 48%, rgba(8,25,34,0.80) 100%), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85')",
          }}
        />

        {/* Glow */}
        <div className="pointer-events-none absolute left-[15%] top-1/4 h-56 w-56 rounded-full bg-[#0F9690]/15 blur-[100px] sm:h-72 sm:w-72" />

        <div className="pointer-events-none absolute right-[10%] top-1/3 h-40 w-40 rounded-full bg-[#19B5AE]/10 blur-[80px] sm:h-60 sm:w-60" />

        {/* Content */}
        <div className="relative mx-auto flex min-h-[380px] w-full max-w-[1240px] items-center px-4 sm:px-6 lg:px-8 py-20 sm:min-h-[430px] sm:py-24 lg:min-h-[470px]">

          <div className="w-full max-w-[700px] animate-[fadeUp_.7s_ease-out_both]">

            <div className="mb-4 flex items-center gap-2.5">

              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2AC3BB] shadow-[0_0_12px_rgba(42,195,187,0.9)]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#54D4CD] sm:text-[10px]">
                Get In Touch
              </span>

            </div>

            <h1
              className="max-w-[650px] text-[36px] font-bold leading-[1.05] tracking-tight text-white min-[480px]:text-[42px] sm:text-[50px] lg:text-[60px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Let's Find Your
              <span className="mt-1 block text-[#25B8B1]">
                Perfect Property.
              </span>
            </h1>

            <p className="mt-5 max-w-[570px] text-[13px] leading-6 text-[#C5D3D9] sm:text-[15px] sm:leading-7">
              Whether you're buying, renting, or simply exploring your
              options, our team is ready to help you find the right property.
            </p>

          </div>
        </div>

        {/* Bottom transition */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#F7F9FA] to-transparent" />

      </section>


      {/* CONTENT*/}
      <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">

        {/* Background Glow */}
        <div className="pointer-events-none absolute left-0 top-10 h-64 w-64 rounded-full bg-[#0F9690]/5 blur-[100px] sm:h-80 sm:w-80" />

        <div className="pointer-events-none absolute right-0 bottom-10 h-72 w-72 rounded-full bg-[#0F9690]/5 blur-[110px] sm:h-96 sm:w-96" />

        <div className="relative mx-auto w-full max-w-[1240px]">

          {/* Responsive Grid */}
          <div className="grid w-full grid-cols-1 gap-10 md:gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-14 xl:gap-20">

            {/* LEFT SIDE*/}
            <div className="min-w-0 animate-[fadeUp_.7s_.1s_ease-out_both]">

              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#0F9690] sm:text-[10px]">
                Contact Information
              </span>

              <h2
                className="mt-3 max-w-[500px] text-[29px] font-bold leading-[1.15] tracking-tight text-[#162831] sm:text-[34px] lg:text-[38px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                We're Here To Help.
              </h2>

              <p className="mt-4 max-w-[500px] text-[13px] leading-6 text-[#71818A] sm:text-[14px]">
                Have a question about a property, want to schedule a viewing,
                or need help finding the right home? Reach out to our team.
              </p>

              {/* Contact List */}
              <div className="mt-7 space-y-2.5 sm:mt-8 sm:space-y-3">

                {CONTACT_INFO.map(
                  ({ icon: Icon, label, value, href }, index) => {

                    const cardClass =
                      "group flex min-w-0 items-center gap-3.5 rounded-xl border border-[#E1E9EC] bg-white px-3.5 py-3.5 shadow-[0_4px_18px_rgba(20,40,50,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0F9690]/30 hover:shadow-[0_12px_30px_rgba(15,150,144,0.09)] sm:gap-4 sm:px-4 sm:py-4";

                    const content = (
                      <>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0F9690]/10 text-[#0F9690] transition-all duration-300 group-hover:bg-[#0F9690] group-hover:text-white group-hover:shadow-[0_0_18px_rgba(15,150,144,0.22)] sm:h-11 sm:w-11">
                          <Icon size={17} strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#87969D] sm:text-[9px]">
                            {label}
                          </p>

                          <p className="mt-1 break-words text-[12px] font-medium leading-5 text-[#263B44] sm:text-[13px]">
                            {value}
                          </p>
                        </div>
                      </>
                    );

                    return href ? (
                      <a
                        key={label}
                        href={href}
                        className={cardClass}
                        style={{
                          animation: `fadeUp .6s ${
                            0.15 + index * 0.08
                          }s ease-out both`,
                        }}
                      >
                        {content}
                      </a>
                    ) : (
                      <div
                        key={label}
                        className={cardClass}
                        style={{
                          animation: `fadeUp .6s ${
                            0.15 + index * 0.08
                          }s ease-out both`,
                        }}
                      >
                        {content}
                      </div>
                    );
                  }
                )}

              </div>
            </div>


            {/* RIGHT SIDE — FORM*/}
            <div className="relative min-w-0 animate-[fadeUp_.7s_.2s_ease-out_both]">

              {/* Form Glow */}
              <div className="pointer-events-none absolute -inset-2 rounded-[24px] bg-[#0F9690]/7 blur-2xl sm:-inset-3" />

              <div className="relative w-full overflow-hidden rounded-2xl border border-[#DDE7EA] bg-white shadow-[0_15px_45px_rgba(16,42,52,0.09)] transition-shadow duration-300 hover:shadow-[0_18px_55px_rgba(16,42,52,0.12)]">

                {/* Top Accent Line */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#0F9690] via-[#24B9B1] to-[#0F9690]" />

                <div className="p-6 sm:p-8 lg:p-10">

                  {submitted ? (

                    /*  SUCCESS  */
                    <div className="flex min-h-[380px] flex-col items-center justify-center px-4 py-8 text-center sm:min-h-[420px]">

                      <div className="relative">

                        <div className="absolute -inset-5 rounded-full bg-[#0F9690]/10 blur-2xl" />

                        <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#0F9690]/20 bg-[#0F9690]/10 sm:h-20 sm:w-20">
                          <CheckCircle2
                            size={38}
                            strokeWidth={1.7}
                            className="text-[#0F9690] sm:h-[42px] sm:w-[42px]"
                          />
                        </div>

                      </div>

                      <h3
                        className="mt-6 text-[22px] font-bold text-[#162831] sm:text-2xl"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Message Sent Successfully!
                      </h3>

                      <p className="mt-3 max-w-[360px] text-[13px] leading-6 text-[#71818A]">
                        Thank you for contacting Dream Home Estates.
                        Our team will get back to you within 24 hours.
                      </p>

                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="mt-6 rounded-lg border border-[#D7E2E5] px-5 py-2.5 text-[12px] font-semibold text-[#162831] transition-all duration-200 hover:border-[#0F9690] hover:bg-[#0F9690]/5 hover:text-[#0F9690] cursor-pointer"
                      >
                        Send Another Message
                      </button>

                    </div>

                  ) : (

                    /*  FORM  */
                    <form
                      onSubmit={handleSubmit}
                      className="w-full space-y-5"
                    >

                      {/* Heading */}
                      <div className="mb-6">

                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0F9690]">
                          Get Started
                        </span>

                        <h3
                          className="mt-1 text-[22px] font-bold tracking-tight text-[#162831] sm:text-2xl"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          Send Us a Message
                        </h3>

                        <p className="mt-1.5 max-w-[480px] text-[12px] leading-relaxed text-[#7A8A92]">
                          Tell us what you're looking for and our team will help you
                          find the right property.
                        </p>

                      </div>


                      {/* Name + Email */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div className="min-w-0">

                          <label
                            htmlFor="name"
                            className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#667981]"
                          >
                            Full Name
                          </label>

                          <input
                            id="name"
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            autoComplete="name"
                            className="box-border h-11 w-full min-w-0 rounded-lg border border-[#DCE5E8] bg-[#FAFCFC] px-3.5 text-[13px] text-[#162831] outline-none transition-all duration-200 placeholder:text-[#9AA8AE] hover:border-[#C5D4D9] focus:border-[#0F9690] focus:bg-white focus:ring-4 focus:ring-[#0F9690]/10"
                          />

                        </div>


                        <div className="min-w-0">

                          <label
                            htmlFor="email"
                            className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#667981]"
                          >
                            Email Address
                          </label>

                          <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@email.com"
                            required
                            autoComplete="email"
                            className="box-border h-11 w-full min-w-0 rounded-lg border border-[#DCE5E8] bg-[#FAFCFC] px-3.5 text-[13px] text-[#162831] outline-none transition-all duration-200 placeholder:text-[#9AA8AE] hover:border-[#C5D4D9] focus:border-[#0F9690] focus:bg-white focus:ring-4 focus:ring-[#0F9690]/10"
                          />

                        </div>

                      </div>


                      {/* Phone */}
                      <div>

                        <label
                          htmlFor="phone"
                          className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#667981]"
                        >
                          Phone Number
                        </label>

                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+251 911 000 000"
                          autoComplete="tel"
                          className="box-border h-11 w-full min-w-0 rounded-lg border border-[#DCE5E8] bg-[#FAFCFC] px-3.5 text-[13px] text-[#162831] outline-none transition-all duration-200 placeholder:text-[#9AA8AE] hover:border-[#C5D4D9] focus:border-[#0F9690] focus:bg-white focus:ring-4 focus:ring-[#0F9690]/10"
                        />

                      </div>


                      {/* Message */}
                      <div>

                        <label
                          htmlFor="message"
                          className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#667981]"
                        >
                          Your Message
                        </label>

                        <textarea
                          id="message"
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Tell us about the property you're looking for..."
                          required
                          className="box-border min-h-[120px] w-full min-w-0 resize-none rounded-lg border border-[#DCE5E8] bg-[#FAFCFC] px-3.5 py-3 text-[13px] leading-5 text-[#162831] outline-none transition-all duration-200 placeholder:text-[#9AA8AE] hover:border-[#C5D4D9] focus:border-[#0F9690] focus:bg-white focus:ring-4 focus:ring-[#0F9690]/10"
                        />

                      </div>


                      {/* Submit */}
                      <button
                        type="submit"
                        className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0F9690] px-5 text-[13px] font-semibold text-white shadow-[0_6px_20px_rgba(15,150,144,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0D827D] hover:shadow-[0_10px_28px_rgba(15,150,144,0.28)] active:translate-y-0 sm:h-12 cursor-pointer"
                      >
                        <Send size={15} />

                        <span>Send Message</span>

                        <ArrowUpRight
                          size={15}
                          className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </button>


                      <p className="pt-1 text-center text-[10px] leading-4 text-[#98A6AC]">
                        We respect your privacy and will never share your information.
                      </p>

                    </form>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ANIMATION KEYFRAMES*/}
      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(18px);
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

export default Contact;