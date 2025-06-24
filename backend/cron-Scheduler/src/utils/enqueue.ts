import { schedulerClient } from "..";
import { fetchMonitorsByIntervals } from "./fetchMonitors";

export const enqueueForInterval = async (interval: number) => {
  const listKey = `monitor-queue:${interval}`;
  const batchSize = 200;
  let batch: string[] = [];

  for await (const mon of fetchMonitorsByIntervals(interval)) {
    batch.push(mon);
    if (batch.length === batchSize) {
      await schedulerClient.lPush(listKey, batch);
      console.log('pushed batch ')
      batch = [];
    }
  }

  if (batch.length > 0) {
    await schedulerClient.lPush(listKey, batch);
    console.log('pushed batch ',1)
  }
};
