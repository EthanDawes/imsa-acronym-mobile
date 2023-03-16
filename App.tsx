import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import "react-native-gesture-handler";

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import * as NavigationBar from "expo-navigation-bar";
import Colors from "./constants/Colors";
import {initNotifications} from "./Notify";
import {initBackgroundSync} from "./Sync";

// initNotifications();
// initBackgroundSync();
// @ts-ignore This has to exist so the collapsable header doesn't clip (see react-navigation-collapsable/lib/src/utils.js)
global.Expo = true;

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  NavigationBar.setBackgroundColorAsync(Colors[colorScheme].header);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
