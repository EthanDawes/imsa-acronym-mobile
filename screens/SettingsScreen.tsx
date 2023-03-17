import {Button, Pressable, ScrollView, StyleSheet, Switch, View} from 'react-native';

import {Hr, Text, Title, useAndroidRipple} from '../components/Themed';
import Colors from "../constants/Colors";
import {FontAwesome} from "@expo/vector-icons";
import * as React from "react";
import useColorScheme from "../hooks/useColorScheme";
import {RootStackScreenProps} from "../types";
import * as Notifications from 'expo-notifications';
import useAsyncStorage from "../hooks/useAsyncStorage";
import {notifyTest} from "../Notify";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen({navigation}: RootStackScreenProps<"Settings">) {
  const colorScheme = useColorScheme();
  const androidRipple = useAndroidRipple();

  return (
    <ScrollView style={styles.container}>
      {/*<Title>General</Title>
      <View style={{flexDirection: "row"}}>
        <Text style={{flexGrow: 100}}>Default Page</Text>
      </View>
      <Button title={"Clear app data"} onPress={() => AsyncStorage.clear()} />
      <Button title={"Test notifications"} onPress={notifyTest} />
      <Hr />*/}
      {/*<Hr />
      <Title>Stats</Title>*/}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 0,
  },
});
