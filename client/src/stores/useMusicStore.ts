import { axiosInstance } from "@/lib/axios";
import type { Album, Genre, Playlist, Song } from "@/types";
import { create } from "zustand";

interface MusicStore {
  albums: Album[];
  genres: Genre[];
  playlists: Playlist[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featured: Song[];
  madeForYou: Song[];
  trending: Song[];

  fetchAlbums: () => Promise<void>;
  fetchTrending: () => Promise<void>;
  fetchFeatured: () => Promise<void>;
  fetchMadeForYou: () => Promise<void>;
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
  featured: [],
  trending: [],
  madeForYou: [],

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/albums");
      set({ albums: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
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
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeatured: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/featured");
      set({ featured: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrending: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/trending");
      set({ trending: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMadeForYou: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/made-for-you");
      set({ madeForYou: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
