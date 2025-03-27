import {
  View, //strucutre
  Text,
  FlatList, // liste optimisée
  Image, // afficher l'affiche du film
  TouchableOpacity, //  bouton cliquable
  ActivityIndicator, // rond de chargement
  TextInput, // Pour la recherche de film
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated"; // FadeInDown: pour faire apparaitre les films avec une animations fluide
import { useState } from "react"; // Pour stocker ce que l'utilisateur tape dans le champ de recherche
import useFetchMovies from "../../hooks/useFetchMovies"; // hook custom pour appeller l'API de TmDb selon ce que l'utilisateur tape (searchTherm)
import { Link } from "expo-router"; // pour naviguer vers la page détail du film

export default function Home() {
  const [search, setSearch] = useState(""); // état local pour stocker le texte entré par l'utilisateur dans le champ de recherche
  const { movies, loading } = useFetchMovies(search); // le hook qui retourne movies donc tableau de film à afficher et loading qui indique les données sont entrain de charger

  //À chaque caractère tapé : search est mis à jour, useFetchMovies(search) est rappelé automatiquement Et les résultats changent
  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Rechercher un film..."
        value={search}
        onChangeText={setSearch}
        style={{
          margin: 16,
          padding: 12,
          borderRadius: 8,
          backgroundColor: "#f0f0f0",
          fontSize: 16,
        }}
      />

      {loading ? (
        // Si l'app charge les données alors on affiche un spinner
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          // Quand les films sont prêts, on les affiches avec FlatList.
          data={movies} // source de données d'un tableau d'objet (id, title,...) récupérer par mon hook useFetchmovies
          keyExtractor={(item) => item.id} // veut une clé unique pour chaque item dans la liste
          contentContainerStyle={{ paddingHorizontal: 16 }}
          //fonction qui décrit comment afficher chaque film dans la liste. item est un film. index sa position dans la liste
          renderItem={({ item, index }) => (
            //entering : propriété spécialde Animated.View qui permet de définir ce qu’il se passe quand le composant apparaît à l’écran. asChild: créé mon propre bouton touchableOpacity
            <Animated.View entering={FadeInDown.delay(index * 100)}>
              <Link href={`/movie/${item.id}`} asChild>
                <TouchableOpacity
                  style={{
                    marginBottom: 16,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: item.poster }}
                    style={{ width: 100, height: 150, borderRadius: 8 }}
                  />
                  <View style={{ marginLeft: 12, flexShrink: 1 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      {item.title}
                    </Text>
                    <Text numberOfLines={3} style={{ color: "gray" }}>
                      {item.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Link>
            </Animated.View>
          )}
        />
      )}
    </View>
  );
}
