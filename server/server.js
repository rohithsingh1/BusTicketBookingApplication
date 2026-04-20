import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Bus Ticket Booking API is running",
  });
});

const server = app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

server.on("error", (error) => {
  console.error("Server failed to start:", error);
});

server.on("close", () => {
  console.log("HTTP server was closed.");
});

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    console.log(`Received ${signal}. Shutting down server...`);
    server.close(() => {
      process.exit(0);
    });
  });
});
