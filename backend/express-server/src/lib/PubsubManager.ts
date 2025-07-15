import { createClient, RedisClientType } from "redis";
import { WebSocket } from "ws";

export class PubsubManager {
  private static instance: PubsubManager;
  private redisClient: RedisClientType;
  private subscriptions: Map<string, Set<WebSocket>>;
  private channelSub:boolean=false;

  private constructor() {
    this.redisClient = createClient({
      url: `${process.env.REDIS_CLIENT}`,
    });
    this.redisClient.connect();
    this.subscriptions = new Map();
  }
  //creating a single instance of redisClient
  public static getInstance():PubsubManager{
    if(!PubsubManager.instance){
        PubsubManager.instance=new PubsubManager();
    }
    return PubsubManager.instance;
  }
  public async subscribe(userID:string,ws:WebSocket){
   //checking that this userId is sub?
  if(!this.subscriptions.has(userID)) {
    //create one 
     this.subscriptions.set(userID,new Set());
  }
  this.subscriptions.get(userID)?.add(ws);
  //subscribing once to channel 
  if(!this.channelSub){
    this.channelSub=true;
    await this.redisClient.subscribe('monitor_update',(message) => {
          //writing socket code for realtime update for a specific user
          const payloadData = JSON.parse(message);
          const data = {
            type: "monitor_with_history",
            payload: payloadData,
          };
          //getting sockets from ws object
          const sockets = this.subscriptions.get(payloadData.userId);
    
          sockets &&
            sockets.forEach((ws: WebSocket) => {
              if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(data));
              }
            });
        })
  }
  }
  public async unSubscribe(userID:string,ws:WebSocket){
    const userSockets=this.subscriptions.get(userID);
    if(userSockets){
    userSockets.delete(ws);
    }
    if(userSockets && userSockets.size===0){
        this.subscriptions.delete(userID);
        await this.redisClient.unsubscribe('monitor_update');
        this.channelSub=false;
    }
  }
  public async disconnect(){
    try {
        await this.redisClient.quit();
        console.log('PubsubManager disconnected from Redis');
    } catch (error) {
    console.error('Error during PubsubManager disconnect:', error);
    }
  }
}
