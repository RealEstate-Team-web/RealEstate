require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const apiRoutes = require("./routes");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === clientUrl) {
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
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
