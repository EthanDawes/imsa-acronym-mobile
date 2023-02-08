import { Pressable, StyleSheet, Switch} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import {androidRipple, Hr, Text, Title, View} from '../components/Themed';
import {useState} from "react";
import Colors from "../constants/Colors";
import {FontAwesome} from "@expo/vector-icons";
import * as React from "react";
import useColorScheme from "../hooks/useColorScheme";
import {RootStackScreenProps} from "../types";

export default function SettingsScreen({navigation}: RootStackScreenProps<"Settings">) {
  const colorScheme = useColorScheme();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <Title>General</Title>
      <View style={{flexDirection: "row"}}>
        <Text style={{flexGrow: 100}}>Dark Theme</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <View style={{flexDirection: "row"}}>
        <Text style={{flexGrow: 100}}>Default Page</Text>
      </View>
      <Hr />
      <Title>Notifications</Title>
      <Pressable style={{flexDirection: "row"}}
                 android_ripple={androidRipple()}
                 onPress={() => navigation.navigate("Notifications", {category: "topics"})}
      >
        <Text style={{flexGrow: 100}}>Topics</Text>
        <FontAwesome
          name={"caret-right"}
          size={25}
          color={Colors[colorScheme].text}
          style={{marginRight: 15, marginLeft: 15}}
        />
      </Pressable>
      <Pressable style={{flexDirection: "row"}}
                 android_ripple={androidRipple()}
                 onPress={() => navigation.navigate("Notifications", {category: "authors"})}
      >
        <Text style={{flexGrow: 100}}>Authors</Text>
        <FontAwesome
          name={"caret-right"}
          size={25}
          color={Colors[colorScheme].text}
          style={{marginRight: 15, marginLeft: 15}}
        />
      </Pressable>
      <Hr />
      <Title>Stats</Title>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 0,
  },
});
