import { prisma } from "../lib/prisma";
import { Router } from "express";
export const internalMonitor_routes=Router();
internalMonitor_routes.get('/monitors',async(req,res)=>{
    const {cursor,interval,pageSize}=req.query
    const filter:{interval:number,id?:{gt:number}}={interval:Number(interval)}
    if(cursor) filter.id={gt:Number(cursor)}
     try {
        const monitors=await prisma.monitor.findMany({
            where:filter,
            take:Number(pageSize),
            orderBy:{id:'asc'}
        })
        res.status(201).json({monitors:monitors,nextCursor:monitors[monitors.length-1]?.id??null})
        return;
     } catch (error) {
        console.log('error while fetching from db',error)
        res.status(500);
        return
     }
})
internalMonitor_routes.post('/updateMonitorsandHist',async(req,res)=>{
   // {status,responseTime,monitorId}
   const {status,responseTime,monitorId}=req.body;
   try {
await prisma.$transaction(async(c)=>{
    await c.history.create({
         data:{
            monitorId:monitorId,
            lastStatus:status,
            responseTime:responseTime
         }, 
      })
    await c.monitor.update({
         where:{id:monitorId},
         data:{currentStatus:status},
     
      })
      return ;
      })

      const MONITOR_DATA= await prisma.monitor.findUnique({
         where:{id:monitorId},
         include:{user:{select:{email:true}},history:{take:30,orderBy:{lastPing:'desc'}}}
      })
      res.status(200).json({monitor:MONITOR_DATA})
      return;
   } catch (error) {
      console.log('error while updating monitor and creating history',error);
      res.status(500).json("error while updating monitor and creating history");
      return;
   }

})