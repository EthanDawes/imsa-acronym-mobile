import {Button, Pressable, ScrollView, StyleSheet, Switch} from 'react-native';

import {useAndroidRipple, Hr, Text, Title, View} from '../components/Themed';
import {useState} from "react";
import Colors from "../constants/Colors";
import {FontAwesome} from "@expo/vector-icons";
import * as React from "react";
import useColorScheme from "../hooks/useColorScheme";
import {RootStackScreenProps} from "../types";
import {useBookmarks} from "../components/Article/logic";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ArticleFilter} from "../constants/api";

export default function SettingsScreen({navigation}: RootStackScreenProps<"Settings">) {
  const colorScheme = useColorScheme();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [bookmarks, toggleBookmarks] = useBookmarks();

  return (
    <ScrollView style={styles.container}>
      <Title>General</Title>
      <View style={{flexDirection: "row"}}>
        <Text style={{flexGrow: 100}}>Default Page</Text>
      </View>
      <Button title={"Clear app data"} onPress={() => AsyncStorage.clear()} />
      <Hr />
      <Title>Notifications</Title>
      <NotificationsSubmenu domain="Topics" navigation={navigation} />
      <NotificationsSubmenu domain="Authors" navigation={navigation} />
      <NotificationsSubmenu domain="Tags" navigation={navigation} />
      <Hr />
      <Title>Stats</Title>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 0,
  },
});

function NotificationsSubmenu({domain, navigation}: {domain: ArticleFilter} & Pick<RootStackScreenProps<"Settings">, "navigation">) {
  return (
    <Pressable style={{flexDirection: "row", paddingVertical: 10}}
               android_ripple={useAndroidRipple()}
               onPress={() => navigation.navigate("Notifications", {category: domain})}
    >
      <Text style={{flexGrow: 100}}>{domain}</Text>
      <FontAwesome
        name={"caret-right"}
        size={25}
        color={Colors[useColorScheme()].text}
        style={{marginRight: 15, marginLeft: 15}}
      />
    </Pressable>
  );
}
