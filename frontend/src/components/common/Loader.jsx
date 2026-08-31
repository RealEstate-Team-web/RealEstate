import { useEffect, useState } from "react";
import { Home } from "lucide-react";

const LOADING_MESSAGES = [
  "Finding your perfect home...",
  "Exploring beautiful properties...",
  "Checking available listings...",
  "Preparing your experience...",
];

const PageLoader = ({ loading = true }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(
        (current) => (current + 1) % LOADING_MESSAGES.length
      );
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading) {
      setFinishing(true);
    }
  }, [loading]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0D1F27] transition-opacity duration-300 ${
        finishing ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center">

        {/* Circular Loader */}
        <div className="relative h-14 w-14">

          <svg
            viewBox="0 0 56 56"
            className="absolute inset-0 h-full w-full animate-spin"
            style={{
              animationDuration: "1s",
            }}
          >
            {/* Track */}
            <circle
              cx="28"
              cy="28"
              r="25"
              fill="none"
              stroke="#29414A"
              strokeWidth="2.5"
            />

            {/* Moving arc */}
            <circle
              cx="28"
              cy="28"
              r="25"
              fill="none"
              stroke="#0F9690"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="42 115"
            />
          </svg>

          {/* House */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Home
              className="h-5 w-5 text-[#0F9690]"
              strokeWidth={1.8}
            />
          </div>

        </div>

        {/* Brand */}
        <h1 className="mt-5 text-lg font-semibold tracking-tight text-white">
          NestHome
        </h1>

        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.25em] text-[#0F9690]">
          Real Estate
        </p>

        {/* Message */}
        <div className="mt-5 h-5 overflow-hidden">
          <p
            key={messageIndex}
            className="animate-[fadeUp_.35s_ease-out] text-xs text-slate-400"
          >
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>

      </div>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;