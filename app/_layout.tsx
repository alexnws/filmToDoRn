import { Slot } from "expo-router"; // Slot est un composant spécial d'expo-router qui va afficher dynamiquement la bonne page (ex: index.tsx, favorites.tsx, etc.)
import { SafeAreaView } from "react-native-safe-area-context"; // permet d’éviter que le contenu touche les bords de l’écran
import { AppProvider } from "../context/AppContext"; // AppProvider fournit le contexte global (favoris et watchlist) à toute l’application via Context + Reducer

export default function RootLayout() {
  // layout principal de l'app
  return (
    // j'encapsules toute ton application dans le AppProvider, pour que toutes les pages aient accès au state global (state, dispatch). flex 1 prend tout l'écran
    <AppProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Slot />
      </SafeAreaView>
    </AppProvider>
  );
}
