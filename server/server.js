require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  raw: true,
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});
mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection failed", err);
});

//import routes
const authRoutes = require("./routes/auth");

// app middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());

if (process.env.NODE_ENV == "development") {
  app.use(cors({ origin: `http://localhost:3000` }));
}

//middleware
app.use("/api", authRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
