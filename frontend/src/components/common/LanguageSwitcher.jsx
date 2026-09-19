import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "am", label: "አማ" },
];

const LanguageSwitcher = ({ variant = "light" }) => {
  const { i18n } = useTranslation();

  const isLight = variant === "light";

  return (
    <div
      className={`inline-flex items-center rounded-full border p-0.5 text-[11px] font-semibold leading-none ${
        isLight
          ? "border-[#0F9690]/30 bg-[#E8F7F5]"
          : "border-[#2C4450] bg-[#1B3039]"
      }`}
      role="group"
      aria-label="Language"
    >
      {LANGUAGES.map((lang) => {
        const active = i18n.resolvedLanguage === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => i18n.changeLanguage(lang.code)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 transition-colors cursor-pointer ${
              active
                ? "bg-[#0F9690] text-white shadow-sm"
                : isLight
                  ? "text-[#0F9690] hover:bg-[#D7F0EC]"
                  : "text-[#8FA1AA] hover:bg-[#2C4450] hover:text-white"
            }`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;