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
import {useNetInfo} from "@react-native-community/netinfo";

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
import {useBookmarks, useSubscriptions} from "../components/Article/logic";
import {BookmarkContext, SubscriptionsContext, TopicsContext, SizeContext} from '../constants/context';
import ArticleScreen from "../screens/ArticleScreen";
import BookmarkShare from "../components/Article/BookmarkShare";
import {SearchDetailsScreen} from "../screens/SearchDetailsScreen";
import wp, {getAllCategories} from "../constants/api";
import CommentsScreen from "../screens/CommentsScreen";
import useAsyncStorage from "../hooks/useAsyncStorage";

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
  const usedSubscriptions = useSubscriptions();
  const [subscriptions, toggleSubscriptions] = usedSubscriptions;

  return (
    <BookmarkContext.Provider value={useBookmarks()}>
      <SubscriptionsContext.Provider value={usedSubscriptions}>
        {/* I'm not a fan of hard-coding this, but Acronym asked for it.
        Showing only top-level categories won't work because it excludes humor & includes Titan 411 */}
        <TopicsContext.Provider value={Promise.resolve({
          "Arts & Entertainment": 1020, Humor: 2490, "Letters to the Editor": 2927, Lifestyle: 1021,
          News: 1019, Opinions: 12, "Special Editions": 2723,
        })}>
          <SizeContext.Provider value={useAsyncStorage("fontSize", 0)}>
            <Stack.Navigator screenOptions={{
              //cardStyle: { backgroundColor: 'red' } This changes the background-color app-wide
            }}>
              <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
              <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
              <Stack.Group screenOptions={({ navigation }: RootStackScreenProps<keyof RootStackParamList>) => ({
                headerLeft: () => IconButton({icon: "arrow-left", action: () => navigation.goBack()}),
              })}>
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Search" component={SearchScreen} />
                <Stack.Screen name="SearchDetails" component={SearchDetailsScreen} options={({navigation, route}: RootStackScreenProps<"SearchDetails">) => ({
                  headerTitleAlign: 'center',
                  headerRight: () => <IconButton icon={route.params.id in subscriptions ? "bell" : "bell-o"} action={toggleSubscriptions.bind(null, route.params)} />,
                  // header: () => <SearchDetailsHeader {...route.params} />,
                })} />
                <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
                <Stack.Screen name="Article" component={ArticleScreen} options={({route}: RootStackScreenProps<"Article">) => ({
                  title: "",
                  headerRight: () => <BookmarkShare {...route.params.body} enableHeart={true} />,
                })} />
                <Stack.Screen name="Comments" component={CommentsScreen} />
              </Stack.Group>
            </Stack.Navigator>
          </SizeContext.Provider>
        </TopicsContext.Provider>
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
  const netInfo = useNetInfo();

  return (
    <BottomTab.Navigator
      initialRouteName="FeedTab"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Group screenOptions={({ navigation }: RootTabScreenProps<keyof RootTabParamList>) => ({
        headerTitleAlign: 'center',
        headerRight: () => IconButton({icon: "bell", action: () => navigation.navigate("Notifications")}),
        headerLeft: () => IconButton({icon: "gear", action: () => navigation.navigate("Settings")}),
      })}>
        { (netInfo.isConnected == undefined || netInfo.isConnected) &&
          <BottomTab.Screen
            name="FeedTab"
            component={FeedScreen}
            options={({ navigation }: RootTabScreenProps<'FeedTab'>) => ({
              title: 'Feed',
              headerTitle: (props) => <Image
                style={{ aspectRatio: 5.0957, height: "100%", resizeMode: "contain", alignSelf: "center" }}
                source={useColorScheme() === "light" ? require('../assets/images/acronym_title.png') : require('../assets/images/acronym_title_dark.png')}
              />,
              headerTitleContainerStyle: { width: "100%", paddingBottom: 3 },
              tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            })}
          />
        }
        <BottomTab.Screen
          name="SavedTab"
          component={SavedScreen}
          options={({ navigation }: RootTabScreenProps<'SavedTab'>) => ({
            title: 'Saved',
            tabBarIcon: ({ color }) => <TabBarIcon name="bookmark" color={color} />,
          })}
        />
      </BottomTab.Group>
      { netInfo.isConnected &&
        <BottomTab.Screen
          name="SearchTab"
          component={SearchScreen}
          options={({ navigation }: RootTabScreenProps<'SearchTab'>) => ({
            title: 'Search',
            tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          })}
        />
      }
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
