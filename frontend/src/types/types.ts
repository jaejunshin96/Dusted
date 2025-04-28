export interface Movie {
  id: number;
  movie_id: number;
  original_title: string;
  title: string;
  directors: [string];
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
  review: string;
  rating: number;
  backdrop_path: string | null;
  poster_path: string | null;
  date_created: string;
}
