const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/db.js");
const AuthRouter = require("./router/AuthRouter.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3004;

// data base connection
connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - more permissive for local development
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/api/auth", AuthRouter);

app.use("/", (req, res) => {
  res.send("Hello World");
});

// module.exports = app;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
