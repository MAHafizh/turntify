import { axiosInstance } from "@/lib/axios";
import type { User } from "@/types";
import { create } from "zustand";

interface ChatStore {
  users: User[];
  fetchUser: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useChatStore = create<ChatStore>((set) => ({
  users: [],
  error: null,
  isLoading: false,

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users");
      set({ users: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
