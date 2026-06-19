// server/src/app.js

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
// Routes
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import savedCollegeRoutes from "./routes/savedCollegeRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import guidanceRoutes from "./routes/guidanceRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import universityRoutes from './routes/universityRoutes.js';


const app = express();

app.set("trust proxy", 1);
// ===============================
// 🔹 MIDDLEWARE
// ===============================

// Parse JSON
app.use(express.json());

// CORS (allow frontend)
const allowedOrigins = [
  "http://localhost:5173",
  "https://rseducationsolution.in"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// 🚦 RATE LIMITER
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests
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

app.use("/api/tickets", ticketRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api", savedCollegeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/guidance", guidanceRoutes);
app.use("/api/leads", leadRoutes);

// Routes
app.use('/api/universities', universityRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  res.send('RS Education Fee Structure API is running...');
});

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