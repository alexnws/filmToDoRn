import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppProvider } from "../context/AppContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Slot />
      </SafeAreaView>
    </AppProvider>
  );
}
