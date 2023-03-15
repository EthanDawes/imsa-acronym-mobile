/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {FontAwesome} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {ColorSchemeName, Image} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import FeedScreen from '../screens/FeedScreen';
import SavedScreen from '../screens/SavedScreen';
import {RootStackParamList, RootStackScreenProps, RootTabParamList, RootTabScreenProps} from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import IconButton from "../components/IconButton";
import GamesScreen from '../screens/GamesScreen';
import SegmentedSearch from "../components/SegmentedSearch";
import {useBookmarks, useSubscriptions} from "../components/Article/logic";
import {BookmarkContext, SubscriptionsContext} from '../constants/context';
import ArticleScreen from "../screens/ArticleScreen";
import BookmarkShare from "../components/Article/BookmarkShare";
import {searchDomains} from "../constants/api";
import {SearchDetailsScreen} from "../screens/SearchDetailsScreen";
import WebBrowser from "../screens/WebBrowser";

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <BookmarkContext.Provider value={useBookmarks()}>
      <SubscriptionsContext.Provider value={useSubscriptions()}>
        <Stack.Navigator screenOptions={{
          //cardStyle: { backgroundColor: 'red' } This changes the background-color app-wide
        }}>
          <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Search" component={SearchScreen} options={({navigation}: RootStackScreenProps<"Search">) => ({
            headerTitle: props => <SegmentedSearch dropdownItems={searchDomains} onInput={(query, domain) => navigation.setParams({query, domain})} placeholder={"Search everything"} />,
          })} />
          <Stack.Screen name="SearchDetails" component={SearchDetailsScreen} options={({navigation, route}: RootStackScreenProps<"SearchDetails">) => ({
            headerTitleAlign: 'center',
            // header: () => <SearchDetailsHeader {...route.params} />,
          })} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Article" component={ArticleScreen} options={({route}: RootStackScreenProps<"Article">) => ({
            title: "",
            headerRight: () => BookmarkShare(route.params.body),
          })} />
          <Stack.Screen name="WebBrowser" component={WebBrowser} />
        </Stack.Navigator>
      </SubscriptionsContext.Provider>
    </BookmarkContext.Provider>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="FeedTab"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Group screenOptions={({ navigation }: RootTabScreenProps<keyof RootTabParamList>) => ({
        headerTitleAlign: 'center',
        headerRight: () => IconButton({icon: "gear", action: () => navigation.navigate("Settings")}),
        headerLeft: () => IconButton({icon: "search", action: () => navigation.navigate("Search", {query: "", domain: "All"})}),
      })}>
        <BottomTab.Screen
          name="FeedTab"
          component={FeedScreen}
          options={({ navigation }: RootTabScreenProps<'FeedTab'>) => ({
            title: 'Feed',
            headerTitle: (props) => <Image
              style={{ width: 250, height: "100%", resizeMode: "contain" }}
              source={useColorScheme() === "light" ? require('../assets/images/acronym_title.png') : require('../assets/images/acronym_title_dark.png')}
            />,
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          })}
        />
        <BottomTab.Screen
          name="SavedTab"
          component={SavedScreen}
          options={({ navigation }: RootTabScreenProps<'SavedTab'>) => ({
            title: 'Saved',
            tabBarIcon: ({ color }) => <TabBarIcon name="bookmark" color={color} />,
          })}
        />
        <BottomTab.Screen
          name="GamesTab"
          component={GamesScreen}
          options={({ navigation }: RootTabScreenProps<'GamesTab'>) => ({
            title: 'Games',
            tabBarIcon: ({ color }) => <TabBarIcon name="puzzle-piece" color={color} />,
          })}
        />
      </BottomTab.Group>
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
