import axios from "axios"
import { useToken } from "../hooks/getToken"
import { useState } from "react"
import { useMonitor } from "../Store/MonitorStore";

const Deletebox: React.FC<{ onCancel: () => void; id: number }> = ({ onCancel, id }) => {
  const {token} = useToken()
  const [isDeleting, setIsDeleting] = useState(false)
  const monitor=useMonitor((s)=>s.monitor)
   console.log(token)
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/monitor/delete/${id}`, {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      onCancel() 
      const filteredMonitor=monitor.filter((m)=>m.id!==Number(id));
      useMonitor.setState({monitor:filteredMonitor})
    } catch (err) {
      console.error("Delete failed:", err)
      setIsDeleting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      {/* Animated modal box */}
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-11/12 max-w-sm mx-auto 
                   animate-fade-in-down transition-transform duration-300 transform scale-95 hover:scale-100"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 cursor-pointer rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 ${
              isDeleting ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Deletebox
