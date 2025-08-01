import { ArrowUpRight,TrashIcon } from "lucide-react"
import { Link } from "react-router-dom";


type history={
     id: number;
    monitorId: number;
    lastStatus: string;
    lastPing: Date;
    responseTime: number | null;
}
type MonitorCard={
    name:string,
    url:string,
    interval:number,
    currentStatus:string|null
    history:history[]
    id:number,
setModal: (payload: { state: boolean; id: number | null }) => void;
}
const MonitorCard = ({name,url,interval,history,id,setModal}:MonitorCard) => {

    const getIntervalLabel=()=>{
        if(interval==1) return "critical (checks every 1 min)"
          if(interval==10) return "High Priority (checks every 10 min)"
            if(interval==59) return "Low Priority (checks every 59 min)"
    }
  return (
    <div className=" rounded-2xl border border-white/10 bg-black/20 backdrop-blur-lg shadow-xl p-4 w-full transition-all hover:border-cyan-400 group">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold text-lg">{name}</h3>
        <div className="flex gap-3 items-center">
         <button onClick={()=>setModal({state:true,id:id})}><TrashIcon className="w-4 h-4  cursor-pointer text-white hover:text-red-600 transition-colors duration-200 "/></button> 
              <Link to={`/history/${id}`} className="text-white hover:scale-125 transition-scale ease-in-out duration-300" ><ArrowUpRight className="w-5 h-5"/></Link>
                <span
          className={`w-3 h-3 rounded-full ${
            history[0]?(history[0]?.lastStatus=== "down" ? "bg-red-400 animate-pulse" : "bg-green-400"):' bg-yellow-400'
        
          }`}
          
        />
        </div>
      
      
      </div>

      <a href={url}><p className="text-gray-400 hover:text-white transition-hover ease-in-out duration-100 text-sm truncate">{url}</p></a>

      <div className="mt-4 text-sm text-cyan-300">
        {getIntervalLabel()}
      </div>
    </div>
   
  
  )
}
export default MonitorCard