import { schedulerClient } from "..";
import { fetchMonitorsByIntervals } from "./fetchMonitors";

export const enqueueForInterval = async (interval: number) => {
  const listKey = `monitor-queue:${interval}`;
  const batchSize = 200;
  let batch: string[] = [];

  for await (const mon of fetchMonitorsByIntervals(interval)) {
    batch.push(mon);
    console.log(batch)
    if (batch.length === batchSize) {
      await schedulerClient.lPush(listKey, batch);
      console.log('pushed batch ')
      await new Promise(resolve=>setTimeout(resolve,2000))
      batch = [];
    }
  }

  if (batch.length > 0) {
    console.log('pushed')
    await schedulerClient.lPush(listKey, batch);
    
  }
};
