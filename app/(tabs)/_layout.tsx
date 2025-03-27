//Le layout dans ce cas me sert à la navigation par onglets (Tabs),
//qui s’affiche sur toutes les pages de l’onglet (Films, Favoris, Watchlist). Elles ont une logique commune.
//Tabs permet de créer une navigation par onglet (tab bar) en bas de l'écran
import { Tabs } from "expo-router";
//Text pour afficher les émojis que j'ai ajouté
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    //On retourne le composant Tabs qui englobe tout les écrans de l'onglet
    <Tabs
      screenOptions={{
        //screenOptions me permet de définir les options de tous les onglets
        headerShown: false, //cache le header par défaut
        tabBarActiveTintColor: "red", //change la couleur du texte de la tab bar
      }}
    >
      <Tabs.Screen
        //Premier onglet : index qui fait référence à index.tsx,
        //tabBarIcon est une option de configuration dans Tabs.Screen
        name="index"
        options={{ title: "Films", tabBarIcon: () => <Text>🎬</Text> }}
      />
      <Tabs.Screen
        name="favorites"
        options={{ title: "Favoris", tabBarIcon: () => <Text>❤️</Text> }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{ title: "À Voir", tabBarIcon: () => <Text>👁️</Text> }}
      />
    </Tabs>
  );
}
