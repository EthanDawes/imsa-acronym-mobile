import {Button, Pressable, ScrollView, StyleSheet, Switch, View} from 'react-native';

import {Hr, LabeledTextInput, Text, TextInput, Title, useAndroidRipple} from '../components/Themed';
import * as React from "react";
import {RootStackScreenProps} from "../types";
import useAsyncStorage from "../hooks/useAsyncStorage";
import {notifyTest} from "../Notify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAsync from "../hooks/useAsync";
import Constants from "expo-constants";
import IconButton from "../components/IconButton";
import {getUserComments} from "../constants/api";
import {MaterialIcons} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import {isProd} from "../constants/lib";

export default function SettingsScreen({navigation}: RootStackScreenProps<"Settings">) {
  return (
    <ScrollView style={styles.container}>
      {!isProd &&
        <>
          <Title>Developer</Title>
          <Button title={"Clear app data"} onPress={() => AsyncStorage.clear()}/>
          <Button title={"Test notifications"} onPress={notifyTest} />
          <Button title={"Forget weeks's notifications"} onPress={async () => AsyncStorage.setItem("lastSyncDate", new Date((new Date(await AsyncStorage.getItem("lastSyncDate") ?? new Date()).getTime()) - 7 * 24 * 60 * 60 * 1000).toISOString())} />
          {/*TODO: <Text>Version: {Constants.expoRuntimeVersion ?? "idk"}</Text>*/}
          <Text>Last checked for new articles on {useAsync(() => AsyncStorage.getItem("lastSyncDate")) ?? "never"}</Text>
          <Text>You are on the {Constants.manifest?.releaseChannel ?? "unknown"} channel</Text>
          <Text>Manifest: {JSON.stringify(Constants.manifest, null, 2)}</Text>
          <Text>Manifest 2: {JSON.stringify(Constants.manifest2, null, 2)}</Text>
          <Hr />
        </>
      }
      <Title>General</Title>
      <GeneralSettings navigation={navigation} />
      <Hr />
      <Title>Account</Title>
      <AccountSettings />
      {/*
      <Hr />
      <Title>Your Stats</Title>
      <Stats />
      */}
    </ScrollView>
  );
}

function GeneralSettings({navigation}: {navigation: RootStackScreenProps<"Settings">["navigation"]}) {
  const {setItem: setFontSize, item: fontSize} = useAsyncStorage("fontSize", 12);
  const colorScheme = Colors[useColorScheme()];

  return (
    <View>
      <View style={{flexDirection: "row"}}>
        {/*<View style={{flexDirection: "row"}}>
          <Text style={{flexGrow: 100}}>Default Page</Text>
        </View>*/}
        <Text style={{flexGrow: 100}}>Font size: {fontSize}pt</Text>
        <IconButton icon={"plus-circle"} action={() => setFontSize(prevState => prevState + 1)} />
        <IconButton icon={"minus-circle"} action={() => setFontSize(prevState => prevState - 1)} />
      </View>
      <Pressable
        style={{flexDirection: "row", height: 36, alignItems: "center"}}
        android_ripple={useAndroidRipple()}
        onPress={async () =>
          navigation.navigate("Comments", {comments: getUserComments(JSON.parse(await AsyncStorage.getItem("name") ?? '""'))})
        }
      >
        <Text style={{flexGrow: 100}}>View your comments</Text>
        <MaterialIcons name={"chevron-right"} size={24} color={colorScheme.text} />
      </Pressable>
    </View>
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

function Stats() {
  return (
    <View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 0,
  },
});
