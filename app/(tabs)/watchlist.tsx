import { FlatList, Text, View, Image, TouchableOpacity } from "react-native";
import { useAppContext } from "../../context/AppContext"; // j'utilise le contexte global pour accéder à la watchlist
import { Link } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

// je déclare mon composant
export default function WatchlistScreen() {
  const { state } = useAppContext(); // je récupére la watchlist depuis le state globale

  // si la liste est vide alors j'affiche un message
  if (state.watchlist.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Aucun film ajouté à la liste.</Text>
      </View>
    );
  }

  return (
    <FlatList // j'affiche chaque film via flatlist
      data={state.watchlist} //tableau des films dans la watchlist
      keyExtractor={(item) => item.id} // donne une clé unique à chaque film (id)
      contentContainerStyle={{ padding: 16 }}
      //fonction qui décrit comment afficher chaque film dans la liste. item est un film. index sa position dans la liste
      renderItem={({ item, index }) => (
        //entering : propriété spéciale Animated.View qui permet de définir ce qu’il se passe quand le composant apparaît à l’écran. asChild: créé mon propre bouton touchableOpacity
        <Animated.View entering={FadeInDown.delay(index * 100)}>
          <Link href={`/movie/${item.id}`} asChild>
            <TouchableOpacity
              style={{ flexDirection: "row", marginBottom: 16 }}
            >
              <Image
                source={{ uri: item.poster }}
                style={{ width: 80, height: 120, borderRadius: 8 }}
              />
              <View style={{ marginLeft: 12, flexShrink: 1 }}>
                <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
                <Text numberOfLines={2} style={{ color: "gray" }}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      )}
    />
  );
}
