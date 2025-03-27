import { useEffect, useState } from "react";
import axios from "axios";
import { Movie } from "../context/AppContext";

const API_KEY = "1f0af41aa1b8961b4cc87398cc3a827d";
const BASE_URL = "https://api.themoviedb.org/3";

export default function useFetchMovies(searchTerm: string) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchMovies = async () => {
        try {
          setLoading(true);

          const endpoint = searchTerm.trim()
            ? `/search/movie`
            : `/movie/popular`;

          const res = await axios.get(`${BASE_URL}${endpoint}`, {
            params: {
              api_key: API_KEY,
              language: "fr-FR",
              page: 1,
              ...(searchTerm.trim() && { query: searchTerm }),
            },
          });

          const results = res.data.results.map((movie: any) => ({
            id: movie.id.toString(),
            title: movie.title,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            description: movie.overview,
          }));

          setMovies(results);
        } catch (err) {
          console.error("Erreur API TMDb", err);
        } finally {
          setLoading(false);
        }
      };

      fetchMovies();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return { movies, loading };
}
