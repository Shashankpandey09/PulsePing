import express from "express";
// import { Ngrok } from "./middlewares/ngrok";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import clerkWebhookRouter from "./routes/Register";
import monitorRoute from "./routes/Monitor";
import { WebSocketServer } from "ws";
import { createClient } from "redis";
import { requireAuth } from "@clerk/express";
import { apiKeyAuth } from "./middleware/apiKey_Auth";
import { internalMonitor_routes } from "./routes/internalMonitors_routes";
import { verifyToken } from "@clerk/clerk-sdk-node";
import { PubsubManager } from "./lib/PubsubManager";
import { AuthSocket } from "./types";
const app = express();
dotenv.config();
//creating redisClient
const redisClient = createClient({
  url: `${process.env.REDIS_CLIENT}`,
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ],
    credentials: false,
  })
);

app.use("/clerk-webhook", clerkWebhookRouter);

app.use(express.json());

app.use(clerkMiddleware());

//clerk auth Regular routes
app.use("/monitor", requireAuth(), monitorRoute);
//internal routes for my scheduler and workers basically my backend services
app.use("/internal", apiKeyAuth, internalMonitor_routes);
app.get("/", (req, res) => {
  res.send("hello");
});

async function startServer() {
  try {
    //connecting redisClient
  
    //creating an http server
    const httpServer = app.listen(process.env.PORT || 3000, () => {
      console.log(`server listening on port ${process.env.PORT}`);
    });
    //upgrading it to the websocket server
    const wss = new WebSocketServer({ server: httpServer });
    console.log(process.env.CLERK_ISSUER);

    wss.on("connection", (ws: AuthSocket) => {
      ws.on("error", (err) => console.error(err));
      ws.once("message", async (data) => {
        const parsed_Data = JSON.parse(data.toString());
        const token = parsed_Data.token;
        // console.log(token)
        try {
          console.log(process.env.CLERK_ISSUER);
          const result = await verifyToken(token, {
            authorizedParties: [process.env.FRONTEND_API!],
            jwtKey: process.env.CLERK_JWT_KEY,
           skipJwksCache: false,
          });

          const userID = result?.sub;
          console.log("no err", result);
          ws.userID = userID;

          PubsubManager.getInstance().subscribe(userID, ws);
        } catch (error) {
          console.log("hey");
          ws.close(4001, `error has occ-${error} `);
          return;
        }
        ws.on("close", () => {
          PubsubManager.getInstance().unSubscribe(ws.userID!, ws);
        });
      });
    });
    //subscribing my Server to the channel Monitor update
  } catch (error) {
    console.log("error occurred", error);
  }
}
const shutdown=async()=>{
  console.log('shutting down...');
  await PubsubManager.getInstance().disconnect();
  process.exit(0)
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
startServer();
