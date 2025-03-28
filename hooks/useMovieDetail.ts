import { useEffect, useState } from "react"; //J’importe useState pour suivre les données récupérées (movie) et l’état de chargement (loading).Et j’utilise useEffect pour déclencher automatiquement l’appel à l’API chaque fois que l’ID du film change.
import axios from "axios"; // pour faire la requête HTTP
import { Movie } from "../context/AppContext"; // Et le type Movie pour typer les données que je récupères

const API_KEY = "1f0af41aa1b8961b4cc87398cc3a827d";
const BASE_URL = "https://api.themoviedb.org/3";

export default function useMovieDetail(movieId: string) {
  // je déclares un hook personnalisé qui attend un identifiant de film en paramètre (movieId).

  const [movie, setMovie] = useState<Movie | null>(null); // contient les informations détaillées du film (titre, description, réalisateurs, etc.) et setMovie c’est une fonction que  j'utiliserais pour mettre à jour cette variable (ex : après l’appel à l’API).
  const [loading, setLoading] = useState(true); // loading : indique si ton appel à l’API est en cours. setLoading : permet de changer cette valeur.

  useEffect(() => {
    // se déclenche à chaque fois que movieId change (grâce au tableau [movieId] en bas).
    const fetchDetails = async () => {
      // appel API
      try {
        const [detailsRes, creditsRes] = await Promise.all([
          // lances 2 requêtes en même temps : Les infos du film (/movie/:id) Les infos sur le cast & crew (/movie/:id/credits) et Promise.all() permet de gagner du temps en les lançant en parallèle
          axios.get(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=fr-FR`
          ),
          axios.get(
            `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=fr-FR`
          ),
        ]);

        // Je récupères les noms des réalisateurs en filtrant les gens dont le job est "Director".
        const directors = creditsRes.data.crew
          .filter((person: any) => person.job === "Director")
          .map((d: any) => d.name);

        const actors = creditsRes.data.cast.slice(0, 5).map((a: any) => a.name); // je récupères les 5 premiers acteurs (pour ne pas tout afficher) avec slice(0, 5).

        // Je prépare un objet movieData au format de mon type Movie, avec toutes les infos que je veux utiliser.
        const movieData: Movie = {
          id: detailsRes.data.id.toString(),
          title: detailsRes.data.title,
          poster: `https://image.tmdb.org/t/p/w500${detailsRes.data.poster_path}`,
          description: detailsRes.data.overview,
          directors,
          actors,
        };

        setMovie(movieData); // Ju mets à jour mon state movie avec les données récupérées mon écran de détails va se mettre à jour.
      } catch (err) {
        console.error("Erreur de récupération du film", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails(); // j'appelles la fonction fetchDetails() dès que le useEffect est lancé.
  }, [movieId]); //Mon effet se relance uniquement si l’ID du film change (par exemple quand j'ouvres un autre détail).

  return { movie, loading }; // j'exportes les deux infos que ton composant va utiliser : movie (l’objet avec tous les détails) loading (true/false pour afficher le "Chargement...")
}
