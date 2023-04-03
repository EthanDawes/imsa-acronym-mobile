import {Button, Pressable, ScrollView, StyleSheet, Switch, View} from 'react-native';

import {Hr, LabeledTextInput, Text, TextInput, Title, useAndroidRipple} from '../components/Themed';
import * as React from "react";
import {RootStackScreenProps} from "../types";
import useAsyncStorage from "../hooks/useAsyncStorage";
import {notifyTest} from "../Notify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAsync from "../hooks/useAsync";
import Constants from "expo-constants";

export default function SettingsScreen({navigation}: RootStackScreenProps<"Settings">) {
  return (
    <ScrollView style={styles.container}>
      {(__DEV__ || true) &&
        <>
          <Title>Developer</Title>
          <Button title={"Clear app data"} onPress={() => AsyncStorage.clear()}/>
          <Button title={"Test notifications"} onPress={notifyTest} />
          <Button title={"Forget weeks's notifications"} onPress={async () => AsyncStorage.setItem("lastSyncDate", new Date((new Date(await AsyncStorage.getItem("lastSyncDate") ?? new Date()).getTime()) - 7 * 24 * 60 * 60 * 1000).toISOString())} />
          {/*TODO: <Text>Version: {Constants.expoRuntimeVersion ?? "idk"}</Text>*/}
          <Text>Last checked for new articles on {useAsync(AsyncStorage.getItem("lastSyncDate")) ?? "never"}</Text>
          <Hr />
        </>
      }
      <Title>General</Title>
      {/*<View style={{flexDirection: "row"}}>
        <Text style={{flexGrow: 100}}>Default Page</Text>
      </View>*/}
      {/*TODO: font size?*/}
      <Hr />
      <Title>Account</Title>
      <AccountSettings />
      <Hr />
      <Title>Your Likes</Title>
      <Hr />
      <Title>Your Comments</Title>
      <Hr />
      <Title>Your Stats</Title>
    </ScrollView>
  );
}

function AccountSettings() {
  const {item: email, setItem: setEmail} = useAsyncStorage("email", "");
  const {item: name, setItem: setName} = useAsyncStorage("name", "");

  return (
    <>
      {/*TODO: acount info + sign in/out?*/}
      <Text>Needed for leaving comments and liking articles</Text>
      <LabeledTextInput
        onChangeText={setName}
        value={name}
        placeholder={"Your Name"}
      >
        Name:
      </LabeledTextInput>
      <LabeledTextInput
        onChangeText={setEmail}
        value={email}
        placeholder={"Your Email"}
      >
        Email:
      </LabeledTextInput>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 0,
  },
});
