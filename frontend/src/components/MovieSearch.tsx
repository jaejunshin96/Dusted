import { useState, useEffect } from "react";
import axios from "axios";

const MovieSearch = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  let debounceTimeout: NodeJS.Timeout;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce API calls to avoid too many requests
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      if (value.length > 1) {
        fetchMovies(value);
      } else {
        setMovies([]); // Clear results if query is empty
      }
    }, 500); // 500ms delay
  };

  const fetchMovies = async (searchTerm: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/film/search/", {
        params: { query: searchTerm },
      });
      setMovies(response.data.results || []);
    } catch (err: any) {
      setError("Failed to fetch movies.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={handleInputChange}
        style={styles.input}
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul style={styles.list}>
        {movies.map((movie) => (
          <li key={movie.id} style={styles.listItem}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    width: "300px",
    margin: "auto",
    textAlign: "center" as const,
  },
  input: {
    width: "100%", // Matches the container width
    padding: "8px",
    fontSize: "16px",
  },
  list: {
    width: "100%", // Matches the container width
    border: "1px solid #ddd",
    listStyleType: "none",
    padding: 0,
    marginTop: "10px",
  },
  listItem: {
    //width: "100%", // Matches the container width
    padding: "8px",
    cursor: "pointer",
    borderBottom: "1px solid #ddd",
  },
};

export default MovieSearch;
