import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[600px] flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-[480px]">
        <p
          className="text-gold font-bold"
          style={{ fontSize: "clamp(80px,14vw,130px)", fontFamily: "var(--font-display)", lineHeight: 1 }}
        >
          404
        </p>
        <h1
          className="text-navy font-bold mt-4"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,3.5vw,32px)" }}
        >
          Page Not Found
        </h1>
        <p className="text-muted mt-3 text-[15px] leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's
          get you back on track.
        </p>
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-teal text-white font-semibold px-6 py-3 rounded-lg hover:bg-teal-dark transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 border border-border text-ink font-semibold px-6 py-3 rounded-lg hover:bg-cream transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse Properties
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;