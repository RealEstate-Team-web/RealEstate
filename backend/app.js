require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const apiRoutes = require("./routes");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

const cleanUrl = (url) => (url ? url.replace(/\/+$/, "") : "");

const clientUrl = cleanUrl(process.env.CLIENT_URL) || "http://localhost:3000";
const frontendUrl = cleanUrl(process.env.FRONTEND_URL);

const allowedOrigins = [
  clientUrl,
  frontendUrl,
  "https://betenya.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

// 1. HELMET
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 2. CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const formattedOrigin = cleanUrl(origin);
      if (allowedOrigins.includes(formattedOrigin)) {
        return callback(null, true);
      }
      if (
        process.env.NODE_ENV !== "production" &&
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// 3. BODY PARSERS
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (buf && buf.length) req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// 4. LOGGING
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// 5. ROUTES
app.use("/api", apiRoutes);

// 6. ERROR HANDLING
app.use(notFound);
app.use(errorHandler);

module.exports = app;
