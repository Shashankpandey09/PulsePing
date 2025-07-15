import express from 'express'
import WebSocket from 'ws';
declare module "express"{
    export interface Request{
        clerkPayload?:Record<string,any>
    }
}
 export interface AuthSocket extends WebSocket {
  userID?: string;
}
