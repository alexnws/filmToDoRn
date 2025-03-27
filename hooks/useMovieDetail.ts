import { useEffect, useState } from "react";
import axios from "axios";
import { Movie } from "../context/AppContext";

const API_KEY = "1f0af41aa1b8961b4cc87398cc3a827d";
const BASE_URL = "https://api.themoviedb.org/3";

export default function useMovieDetail(movieId: string) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [detailsRes, creditsRes] = await Promise.all([
          axios.get(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=fr-FR`
          ),
          axios.get(
            `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=fr-FR`
          ),
        ]);

        const directors = creditsRes.data.crew
          .filter((person: any) => person.job === "Director")
          .map((d: any) => d.name);

        const actors = creditsRes.data.cast.slice(0, 5).map((a: any) => a.name);

        const movieData: Movie = {
          id: detailsRes.data.id.toString(),
          title: detailsRes.data.title,
          poster: `https://image.tmdb.org/t/p/w500${detailsRes.data.poster_path}`,
          description: detailsRes.data.overview,
          directors,
          actors,
        };

        setMovie(movieData);
      } catch (err) {
        console.error("Erreur de récupération du film", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movieId]);

  return { movie, loading };
}
