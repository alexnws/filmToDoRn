import { FlatList, Text, View, Image, TouchableOpacity } from "react-native"; // touchableOpacity permet de cliquer sur chaque bouton, Flatlist: pour afficher la liste des favoris.
import { useAppContext } from "../../context/AppContext"; // contexte global pour accéder aux films favoris
import { Link } from "expo-router"; // permet d'acceder à la page détail
import Animated, { FadeInDown } from "react-native-reanimated";

export default function FavoritesScreen() {
  const { state } = useAppContext(); // je récupere la liste des favoris depuis le context global

  if (state.favorites.length === 0) {
    // si la liste est vide alors j'affiche un message
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Aucun film ajouté en favoris.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={state.favorites} // liste des favoris
      keyExtractor={(item) => item.id} // key unique (id)
      contentContainerStyle={{ padding: 16 }}
      //fonction qui décrit comment afficher chaque film dans la liste. item est un film. index sa position dans la liste
      renderItem={({ item, index }) => (
        //entering : propriété spécialde Animated.View qui permet de définir ce qu’il se passe quand le composant apparaît à l’écran. asChild: créé mon propre bouton touchableOpacity
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
