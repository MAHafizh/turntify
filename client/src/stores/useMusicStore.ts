import { axiosInstance } from "@/lib/axios";
import type { Album, Genre, Playlist } from "@/types";
import { create } from "zustand";

interface MusicStore {
  albums: Album[];
  genres: Genre[];
  playlists: Playlist[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  playlists: [],
  genres: [],
  isLoading: false,
  error: null,
  currentAlbum: null,

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/albums");
      set({ albums: response.data.data });
    } catch (error: any) {
      set({ error: error.response.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      set({ currentAlbum: response.data.data });
    } catch (error: any) {
      set({ error: error.response.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
