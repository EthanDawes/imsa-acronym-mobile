import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";

import useCachedResources from "./hooks/useCachedResources";
import { ColorSchemeName } from "react-native"; // Import ColorSchemeName directly from 'react-native'
import Navigation from "./navigation";
import * as NavigationBar from "expo-navigation-bar";
import Colors from "./constants/Colors";
import { initNotifications } from "./Notify";
import { initBackgroundSync } from "./Sync";
import { View } from "react-native";

initNotifications();
initBackgroundSync();
// @ts-ignore This has to exist so the collapsable header doesn't clip (see react-navigation-collapsable/lib/src/utils.js)
global.Expo = true;

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = "light"; // Force the app to use the light theme

  if (!isLoadingComplete) {
    return null;
  } else {
    NavigationBar.setBackgroundColorAsync(Colors[colorScheme].header);

    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
