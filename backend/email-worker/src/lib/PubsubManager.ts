import { createClient, RedisClientType } from "redis";

export class PubsubManager {
  //creating attributes
  private emailClient: RedisClientType;
  private static instance: PubsubManager;

  private constructor() {
    this.emailClient = createClient({
      url: `${process.env.REDIS_CLIENT}`,
    });
    this.emailClient.connect();
  }
  public static getInstance(): PubsubManager {
    if (!PubsubManager.instance) {
      PubsubManager.instance = new PubsubManager();
    }
    return PubsubManager.instance;
  }

  public getClient() {
    return this.emailClient;
  }
  public async disconnect() {
    try {
      console.log("disconnect from the check worker client");
      this.emailClient.quit();
    } catch (error) {
        console.error('error while disconnecting to workerClient',error)
    }
  }
}
