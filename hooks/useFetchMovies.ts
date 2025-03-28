import { useEffect, useState } from "react"; //UseState sert à stocker les films et le loading et useEffect sert à déclencher l'appel API quand la recherche change
import axios from "axios"; // Pour faire des appels HTTP vers l’API TMDb
import { Movie } from "../context/AppContext"; // Pour que chaque film récupéré ait le bon type (id, title, poster, etc.)

// Infos de connexion à l’API (clé d’API et URL de base)
const API_KEY = "1f0af41aa1b8961b4cc87398cc3a827d";
const BASE_URL = "https://api.themoviedb.org/3";

// Le hook prend en paramètre le texte tapé par l’utilisateur pour la recherche.
export default function useFetchMovies(searchTerm: string) {
  const [movies, setMovies] = useState<Movie[]>([]); // contient la liste des films récupérés
  const [loading, setLoading] = useState(true); // indique si on est en train de charger les films (true/false)

  //Ce useEffect se lance à chaque fois que searchTerm change
  useEffect(() => {
    // On attend 500ms avant de faire l’appel → pour éviter de lancer une requête à chaque frappe de l’utilisateur.
    const delayDebounce = setTimeout(() => {
      const fetchMovies = async () => {
        try {
          setLoading(true); // indicateur de chargement pendant que l’appel API est en cours.

          const endpoint = searchTerm.trim()
            ? `/search/movie` // Si l’utilisateur a tapé quelque chose, ça va  chercher un film (/search/movie)
            : `/movie/popular`; // sinon ça affiche les films populaire

          const res = await axios.get(`${BASE_URL}${endpoint}`, {
            //une requete http avec axios.get et j'appelles l’URL complète en combinant BASE_URL + le endpoint que tu viens de définir.
            params: {
              //parametre à l'api
              api_key: API_KEY, // clé personnelle pour accéder à TMDB
              language: "fr-FR", //pour avoir les titres/descriptions en français
              page: 1,
              ...(searchTerm.trim() && { query: searchTerm }), //  Sert à ajouter la propriété query dynamiquement dans les paramètres d’appel de l’API, seulement si l’utilisateur a saisi quelque chose de valable (pas vide, pas juste des espaces). puis  chaque film est temporairement appelé movie
            },
          });

          //res.data.results c’est la liste brute des films que je reçois depuis l’API TMDb. puis .map pour parcourir chaque film de cette liste et en créer une nouvelle version formatée. et je retournes un nouvel objet pour chaque film. C’est ce qu’on appelle le mapping des données.
          const results = res.data.results.map((movie: any) => ({
            id: movie.id.toString(), // Je prends l’identifiant du film (movie.id) et je le convertis en chaîne de caractères avec .toString(). Pourquoi ? Pour que l’id soit toujours un string, surtout si je  l’utilises plus tard dans des routes (/movie/${id}) ou comme clé.
            title: movie.title, // récupere le titre du film
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`, // récupére l'image du film
            description: movie.overview, // récupre le résumé du film
          }));

          setMovies(results); // // j'enregistrer cette liste de films pour que mon écran puisse les afficher.
        } catch (err) {
          console.error("Erreur API TMDb", err); // si connexion à échouer par exemple un message d'érreur
        } finally {
          setLoading(false); // Quand le chargement est terminé (l’API a répondu ou a échoué)
        }
      };

      fetchMovies(); // se lance seulement 500ms après la dernière frappe
    }, 500);

    return () => clearTimeout(delayDebounce); // annule le timer si  l’utilisateur continue à taper donc evite les anciens appels obselete
  }, [searchTerm]); // Ce useEffect ne doit se déclencher que quand searchTerm change.

  return { movies, loading }; // Ça sert à exposer les données que le hook a préparées, pour pouvoir les utiliser dans un composant.
}
