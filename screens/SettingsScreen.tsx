import {Pressable, ScrollView, StyleSheet, Switch, View} from 'react-native';

import {Text, Title, useAndroidRipple} from '../components/Themed';
import Colors from "../constants/Colors";
import {FontAwesome} from "@expo/vector-icons";
import * as React from "react";
import useColorScheme from "../hooks/useColorScheme";
import {RootStackScreenProps} from "../types";
import {useBookmarks} from "../components/Article/logic";
import {ArticleFilter} from "../constants/api";
import * as Notifications from 'expo-notifications';
import useAsyncStorage from "../hooks/useAsyncStorage";

export default function SettingsScreen({navigation}: RootStackScreenProps<"Settings">) {
  const colorScheme = useColorScheme();
  const {item: allNotifs, setItem: setAllNotifs} = useAsyncStorage("allNotifs", false);
  const toggleAllNotifs = () => setAllNotifs(previousState => !previousState);
  const [bookmarks, toggleBookmarks] = useBookmarks();

  return (
    <ScrollView style={styles.container}>
      {/*<Title>General</Title>
      <View style={{flexDirection: "row"}}>
        <Text style={{flexGrow: 100}}>Default Page</Text>
      </View>
      <Button title={"Clear app data"} onPress={() => AsyncStorage.clear()} />
      <Button title={"Test notifications"} onPress={notifyTest} />
      <Hr />*/}
      <Title>Notifications</Title>
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <Text style={{flexGrow: 100}}>All Notifications</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleAllNotifs}
          value={allNotifs}
        />
      </View>

      {!allNotifs &&
        <>
          <NotificationsSubmenu domain="Topics" navigation={navigation}/>
          <NotificationsSubmenu domain="Authors" navigation={navigation} />
          <NotificationsSubmenu domain="Tags" navigation={navigation} />
        </>
      }
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
