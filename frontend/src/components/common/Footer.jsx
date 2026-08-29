import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-[#263C46] bg-[#162831] text-[#94A3B8]">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">

        {/*  MAIN FOOTER  */}
        <div className="grid grid-cols-1 gap-8 py-9 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-9 lg:grid-cols-[2.2fr_1fr_1fr_1.4fr] lg:gap-10 lg:py-10">

          {/*  BRAND  */}
          <div className="sm:col-span-2 lg:col-span-1">

            <Link
              to="/"
              className="inline-flex items-center gap-2.5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#0F9690] text-sm font-bold leading-none text-white">
                D
              </div>

              <span className="text-[17px] font-bold leading-none tracking-tight text-white">
                NestHome Real Estate
              </span>
            </Link>

            <p className="mt-3.5 max-w-[360px] text-[12px] leading-[1.55] text-[#8FA1AA]">
              Discover quality properties and find your perfect home.
              Explore trusted listings, connect with experienced agents,
              and make your next property move with confidence.
            </p>

            {/* Contact */}
            <div className="mt-5 space-y-2.5">

              <a
                href="mailto:info@dreamhomeestates.com"
                className="flex items-center gap-3 text-[12px] leading-5 transition-colors hover:text-white"
              >
                <Mail
                  size={15}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#0F9690]"
                />

                <span>
                  info@dreamhomeestates.com
                </span>
              </a>

              <a
                href="tel:+251900000000"
                className="flex items-center gap-3 text-[12px] leading-5 transition-colors hover:text-white"
              >
                <Phone
                  size={15}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#0F9690]"
                />

                <span>
                  +251 900 000 000
                </span>
              </a>

              <div className="flex items-center gap-3 text-[12px] leading-5">
                <MapPin
                  size={15}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#0F9690]"
                />

                <span>
                  Addis Ababa, Ethiopia
                </span>
              </div>

            </div>
          </div>

          {/*  COMPANY  */}
          <div>
            <h3 className="mb-4 text-[12px] font-semibold leading-5 text-white">
              Company
            </h3>

            <ul className="space-y-2">

              <li>
                <Link
                  to="/about"
                  className="text-[12px] leading-5 transition-colors hover:text-white"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/properties"
                  className="text-[12px] leading-5 transition-colors hover:text-white"
                >
                  Properties
                </Link>
              </li>

              <li>
                <Link
                  to="/agents"
                  className="text-[12px] leading-5 transition-colors hover:text-white"
                >
                  Agents
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-[12px] leading-5 transition-colors hover:text-white"
                >
                  Contact Us
                </Link>
              </li>

            </ul>
          </div>

          {/*  PROPERTY TYPES  */}
          <div>
            <h3 className="mb-4 text-[12px] font-semibold leading-5 text-white">
              Properties
            </h3>

            <ul className="space-y-2">

              <li>
                <Link
                  to="/properties?type=1"
                  className="text-[12px] leading-5 transition-colors hover:text-white"
                >
                  Apartments
                </Link>
              </li>

              <li>
                <Link
                  to="/properties?type=2"
                  className="text-[12px] leading-5 transition-colors hover:text-white"
                >
                  Villas
                </Link>
              </li>

              <li>
                <Link
                  to="/properties?type=3"
                  className="text-[12px] leading-5 transition-colors hover:text-white"
                >
                  Townhouses
                </Link>
              </li>

              <li>
                <Link
                  to="/properties?type=4"
                  className="text-[12px] leading-5 transition-colors hover:text-white"
                >
                  Commercial
                </Link>
              </li>

            </ul>
          </div>

          {/*  NEWSLETTER  */}
          <div>
            <h3 className="mb-4 text-[12px] font-semibold leading-5 text-white">
              Stay Updated
            </h3>

            <p className="mb-3 max-w-[270px] text-[12px] leading-[1.5] text-[#8FA1AA]">
              Get the latest property listings and real estate updates.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full max-w-[300px]"
            >
              <input
                type="email"
                placeholder="Email address"
                className="h-9 min-w-0 flex-1 rounded-l-md border border-[#334B56] bg-[#1B3039] px-3 text-[11px] leading-none text-white outline-none placeholder:text-[#647983] focus:border-[#0F9690]"
              />

              <button
                type="submit"
                className="h-9 shrink-0 rounded-r-md bg-[#0F9690] px-4 text-[11px] font-medium leading-none text-white transition-colors hover:bg-[#0D827D]"
              >
                Subscribe
              </button>
            </form>

            {/* Social */}
            <div className="mt-4 flex gap-2">

              <a
                href="https://www.facebook.com/dreamhomeestates"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#304650] text-[11px] font-semibold leading-none text-[#8FA1AA] transition-all hover:border-[#0F9690] hover:bg-[#0F9690] hover:text-white"
              >
                f
              </a>

              <a
                href="https://www.linkedin.com/company/dream-home-estates"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#304650] text-[10px] font-semibold leading-none text-[#8FA1AA] transition-all hover:border-[#0F9690] hover:bg-[#0F9690] hover:text-white"
              >
                IG
              </a>

              <a
                href="https://www.linkedin.com/company/dream-home-estates"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#304650] text-[10px] font-semibold leading-none text-[#8FA1AA] transition-all hover:border-[#0F9690] hover:bg-[#0F9690] hover:text-white"
              >
                in
              </a>

            </div>
          </div>
        </div>

        {/*  BOTTOM BORDER  */}
        <div className="border-t border-[#263C46]" />

        {/*  BOTTOM BAR  */}
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[11px] leading-5 text-[#647983]">
            © {new Date().getFullYear()} Dream Home Estates. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">

            <Link
              to="/privacy"
              className="text-[11px] leading-5 text-[#647983] transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="text-[11px] leading-5 text-[#647983] transition-colors hover:text-white"
            >
              Terms of Service
            </Link>

            <Link
              to="/cookies"
              className="text-[11px] leading-5 text-[#647983] transition-colors hover:text-white"
            >
              Cookies
            </Link>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;