/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {NavigationContainer, DefaultTheme, DarkTheme, CompositeScreenProps} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import SettingsScreen from '../screens/SettingsScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import FeedScreen from '../screens/FeedScreen';
import SavedScreen from '../screens/SavedScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import {IconProps} from "@expo/vector-icons/build/createIconSet";

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
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  function IconButton(navigation: any, icon: string, action: string) {  // TODO: I don't know the proper type of icon
    // @ts-ignore
    return (
      <Pressable
        onPress={() => navigation.navigate(action)}
        style={({pressed}) => ({
          opacity: pressed ? 0.5 : 1,
        })}>
        <FontAwesome
          name={icon}
          size={25}
          color={Colors[colorScheme].text}
          style={{marginRight: 15, marginLeft: 15}}
        />
      </Pressable>
    )
  }

  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="FeedTab"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Group screenOptions={({ navigation }: any) => ({  // TODO: any is bad
        headerTitleAlign: 'center',
        headerRight: () => IconButton(navigation, "gear", "Settings"),
        headerLeft: () => IconButton(navigation, "search", "Search"),
      })}>
        <BottomTab.Screen
          name="FeedTab"
          component={FeedScreen}
          options={({ navigation }: RootTabScreenProps<'FeedTab'>) => ({
            title: 'Feed',
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
          component={SavedScreen}
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
