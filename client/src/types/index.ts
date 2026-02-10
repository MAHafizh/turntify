export interface Genre {
  _id: string;
  title: string;
}

export interface Song {
  song: {
    _id: string;
    title: string;
    performer: string;
    writer: string;
    publisher: string;
    album: string | null;
    duration: number;
    imageUrl: string;
    audioUrl: string;
    releaseYear: number;
    genre: Genre[];
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface Album {
  _id: string;
  title: string;
  artist: string;
  releaseYear: number;
  imageUrl: string;
  songs: Song[];
}

export interface Playlist {
  _id: string;
  title: string;
  visibility: "public" | "private";
  songs: Song[] | null;
  description: string | null;
  owner: string;
  collaborators: string[] | null;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
