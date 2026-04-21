import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

dotenv.config();

const {default: app}=await import("./src/app.js");

const HOST=process.env.HOST||"127.0.0.1";
const PORT=process.env.PORT||4000;

const startServer=async () => {
  try {
    await connectDB();

    const server=app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });

    server.on("error", (error) => {
      if (error.code==="EADDRINUSE") {
        console.error(
          `Port ${PORT} on host ${HOST} is already in use. Update PORT in server/.env or stop the process using that port.`
        );
        process.exit(1);
      }

      console.error("Server failed to start:", error);
      process.exit(1);
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
  } catch (error) {
    console.error("Unable to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

startServer();
