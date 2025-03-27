import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useMovieDetail from "../../hooks/useMovieDetail";
import { useAppContext } from "../../context/AppContext";

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const { movie, loading } = useMovieDetail(id as string);
  const { dispatch } = useAppContext();
  const router = useRouter();

  if (loading || !movie) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const handleAddToFavorites = () => {
    dispatch({ type: "ADD_TO_FAVORITES", payload: movie });
  };

  const handleAddToWatchlist = () => {
    dispatch({ type: "ADD_TO_WATCHLIST", payload: movie });
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, backgroundColor: "#fff" }}
    >
      <TouchableOpacity
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

      {movie.directors && (
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: "600" }}>🎬 Réalisateur(s):</Text>
          <Text>{movie.directors.join(", ")}</Text>
        </View>
      )}

      {movie.actors && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: "600" }}>🎭 Acteurs principaux:</Text>
          <Text>{movie.actors.join(", ")}</Text>
        </View>
      )}

      <TouchableOpacity
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
