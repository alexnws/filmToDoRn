import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; //pour récupérer l’id du film dans l’URL et pour naviguer (ex: revenir en arrière)
import useMovieDetail from "../../hooks/useMovieDetail"; // j'importe mon hook personnalisé qui va chercher les détails du film depuis l'API
import { useAppContext } from "../../context/AppContext"; // accede au contexte global pour pouvoir ajouter le film aux favoris ou à la watchlist.

// Déclaration du composant MovieDetail qui s'affiche quand je clique sur un film.
export default function MovieDetail() {
  const { id } = useLocalSearchParams(); // je récupere l'id du film passé dans l'URL dynamique movie/[id]
  const { movie, loading } = useMovieDetail(id as string);
  const { dispatch } = useAppContext(); // je récupere la fonction dispatch pour pouvoir envoyer une action (ADD_TO_FAVORITES, etc)
  const router = useRouter(); // j'initalise le router pour pouvoir naviguer

  if (loading || !movie) {
    // tant que les données du film ne sont pas charger, j'affiche chargement
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chargement...</Text>
      </View>
    );
  }
  // Quand l'utilisateur clique sur "Ajouter au favoris" j'envoie l'action au reducer
  const handleAddToFavorites = () => {
    dispatch({ type: "ADD_TO_FAVORITES", payload: movie });
  };

  // idem pour watchlist
  const handleAddToWatchlist = () => {
    dispatch({ type: "ADD_TO_WATCHLIST", payload: movie });
  };

  return (
    // j'affiche le contenu du film dans une scrollview pour scroller si besoin
    <ScrollView
      contentContainerStyle={{ padding: 16, backgroundColor: "#fff" }}
    >
      <TouchableOpacity // bouton retour
        onPress={() => router.back()}
        style={{ marginBottom: 16 }}
      >
        <Text style={{ fontSize: 18 }}>←</Text>
      </TouchableOpacity>
      <Image
        source={{ uri: movie.poster }}
        style={{
          width: "100%",
          height: 400,
          borderRadius: 12,
          marginBottom: 16,
        }}
        resizeMode="cover"
      />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
        {movie.title}
      </Text>
      <Text style={{ fontSize: 16, color: "#555", marginBottom: 16 }}>
        {movie.description}
      </Text>
      {movie.directors && ( // affiche le ou les réalisateurs
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: "600" }}>🎬 Réalisateur(s):</Text>
          <Text>{movie.directors.join(", ")}</Text>
        </View>
      )}
      {movie.actors && ( // affiche les acteurs sinon on affiche rien (&&)
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: "600" }}>🎭 Acteurs principaux:</Text>
          <Text>{movie.actors.join(", ")}</Text>
        </View>
      )}

      <TouchableOpacity // bouton pour ajouter aux favoris ou à la watchlist
        onPress={handleAddToFavorites}
        style={{
          backgroundColor: "#e63946",
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          ❤️ Ajouter aux favoris
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleAddToWatchlist}
        style={{
          backgroundColor: "#457b9d",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          👁️ Ajouter à la watchlist
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
