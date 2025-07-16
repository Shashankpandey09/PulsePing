import { createClient } from "redis";
import dotenv from "dotenv";
import { sendEmail } from "./utils/sendEmail";

dotenv.config();

const emailClient = createClient({
  url: `${process.env.REDIS_CLIENT}`,
});

const EmailWorker = async () => {
  try {
    emailClient.on("connect", () => console.log("🔌 Redis client connecting…"));
    emailClient.on("ready", () => console.log("✅ Redis client ready"));
    emailClient.on("error", (err) =>
      console.error("❌ Redis client error:", err)
    );
    emailClient.on("end", () => console.warn("⚠️  Redis client disconnected"));

    await emailClient.connect();

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
EmailWorker();
