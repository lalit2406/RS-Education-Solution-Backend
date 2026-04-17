import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});