import { createClient } from "redis";
import dotenv from "dotenv";
import nodeCron from "node-cron";
import { enqueueForInterval } from "./utils/enqueue";
export const schedulerClient = createClient({
  url:`${process.env.REDIS_CLIENT}`
});
dotenv.config();
const StartScheduler = async() => {
  //connecting client
await schedulerClient.connect()
console.log('client Connected')
  //scheduling jobs
  nodeCron.schedule("*/1 * * * *", () => {
    enqueueForInterval(1).catch((err: any) => console.log(err));
  });
  nodeCron.schedule("*/10 * * * *", () => {
    enqueueForInterval(10).catch((err: any) => console.log(err));
  });
  nodeCron.schedule("*/30 * * * *", () => {
    enqueueForInterval(30).catch((err: any) => console.log(err));
  });
  console.log("Schedulers Started Working");
};
 StartScheduler();
