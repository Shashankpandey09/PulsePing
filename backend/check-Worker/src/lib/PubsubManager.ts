import { createClient, RedisClientType } from "redis";

export class PubsubManager {
  //creating attributes
  private workerClient: RedisClientType;
  private static instance: PubsubManager;

  private constructor() {
    this.workerClient = createClient({
      url: `${process.env.REDIS_CLIENT}`,
    });
    this.workerClient.connect();
  }
  public static getInstance(): PubsubManager {
    if (!PubsubManager.instance) {
      PubsubManager.instance = new PubsubManager();
    }
    return PubsubManager.instance;
  }

  public getClient() {
    return this.workerClient;
  }
  public async disconnect() {
    try {
      console.log("disconnect from the check worker client");
      this.workerClient.quit();
    } catch (error) {
        console.error('error while disconnecting to workerClient',error)
    }
  }
}
