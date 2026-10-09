require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const apiRoutes = require("./routes");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// 1. HELMET CONFIGURATION (Must allow cross-origin)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 2. CORS CONFIGURATION
const corsOptions = {
  origin: [
    "https://betenya.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// ALSO explicitly handle preflight OPTIONS requests across all routes
app.options("*", cors(corsOptions));

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
