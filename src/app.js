// server/src/app.js

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
// Routes
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
const app = express();


// ===============================
// 🔹 MIDDLEWARE
// ===============================

// Parse JSON
app.use(express.json());

// CORS (allow frontend)
app.use(
  cors({
    origin: "http://localhost:5173", // your React app
    credentials: true,
  })
);

// 🚦 RATE LIMITER
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  message: "Too many requests, please try again later",
});


app.use("/api", limiter);



// ===============================
// 🔹 ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/documents", documentRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/tasks", taskRoutes);

// ===============================
// 🔹 HEALTH CHECK (optional)
// ===============================

app.get("/", (req, res) => {
  res.send("API is running...");
});


// ===============================
// 🔹 GLOBAL ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something went wrong",
  });
});


export default app;