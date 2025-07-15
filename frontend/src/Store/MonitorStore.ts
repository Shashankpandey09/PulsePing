import { create } from "zustand";
import axios from "axios";
import type { Monitor, history } from "../types/types";

type MonitorPost = Pick<Monitor, "name" | "url" | "interval">;
interface MonitorStoreState {
  loading: boolean;
  monitor: Monitor[];
  error: string | null;
  history: history[];
  buttonLoad: boolean;
  getMonitors: (token: string | null) => Promise<void>;
  addMonitors: (payload: MonitorPost, token: string) => Promise<Boolean>;
  // getHistory:(token:string|null,id:number)=>Promise<void>
}

export const useMonitor = create<MonitorStoreState>((set, get) => ({
  loading: true,
  monitor: [],
  error: null,
  history: [],
  buttonLoad: false,
  getMonitors: async (token) => {
    try {
      if (!token) return;

      set({ loading: true });
      const url = import.meta.env.VITE_BACKEND_URL;

      const resp = await axios.get(`${url}/monitor`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      set({ loading: false, monitor: resp.data?.message });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          loading: false,
          error: error.response?.data?.message || error.message,
        });
      } else {
        set({ loading: false, error: "Something went wrong." });
      }

      console.log(error);
    }
  },
  addMonitors: async (payload, token) => {
    try {
      set({ buttonLoad: true });
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/monitor/create`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ buttonLoad: false });
      await get().getMonitors(token);
      return true;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        set({
          loading: false,
          error: error.response?.data?.message || error.message,
        });
      } else {
        set({ loading: false, error: "Something went wrong." });
      }

      console.log(error);
      return false;
    }
  },
}));
