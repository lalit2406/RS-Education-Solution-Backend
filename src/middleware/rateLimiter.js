import rateLimit from "express-rate-limit";

// 🚫 limit contact form spam
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1, // max 1 request per IP
  message: {
    message: "Too many requests. Please try again later.",
  },
});