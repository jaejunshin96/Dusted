export interface Movie {
  id: number;
  movie_id: number;
  original_title: string;
  title: string;
  directors: [string];
  cast: [string];
  genre_ids: [number];
  release_date: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
}

export interface UserProfile {
  email: string;
  username: string;
  date_joined: string;
  language: string;
  country: string;
  review_count: number;
}

export interface Review {
  id: number;
  movie_id: number;
  title: string;
  directors: string;
  cast: string;
  genre_ids: string;
  review: string;
  rating: number;
  backdrop_path: string | null;
  poster_path: string | null;
  folder_id: number | null;
  date_created: string;
}

export interface Folder {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export type LanguageOption = {
  code: string;
  name: string;
};
