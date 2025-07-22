import { createClient } from "redis";
import dotenv from "dotenv";
import { sendEmail } from "./utils/sendEmail";
import { PubsubManager } from "./lib/PubsubManager";

dotenv.config();

const emailClient = createClient({
  url: `${process.env.REDIS_CLIENT}`,
});

const EmailWorker = async () => {
  try {
    const pubsubManager = PubsubManager.getInstance();
    const emailClient = pubsubManager.getClient();
    emailClient.on("connect", () => console.log("🔌 Redis client connecting…"));
    emailClient.on("ready", () => console.log("✅ Redis client ready"));
    emailClient.on("error", (err) =>
      console.error("❌ Redis client error:", err)
    );
    emailClient.on("end", () => console.warn("⚠️  Redis client disconnected"));

    // iterating for emails indefinitely
    while (true) {
      try {
        const data = await emailClient.brPop("emailQueue", 0);
        console.log("received");
        console.log(data);

        const Data = JSON.parse(data!.element);
        const { Url, name, currentState, userEmail } = Data;

        if (!Url || !name || !currentState || !userEmail) {
          console.error("Invalid email payload:", data!.element);
          continue;
        }

        await sendEmail(name, Url, userEmail, currentState);
        console.log(process.env.EMAIL_USER);
        console.log("email sent successfully for monitor", name);
      } catch (error) {
        console.log(error);
        continue;
      }
    }
  } catch (error) {
    console.log("error while connecting to redis client", error);
  }
};
const shutdown=async()=>{
  console.log('shutting down...');
  await PubsubManager.getInstance().disconnect();
  process.exit(0)
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);


EmailWorker();
