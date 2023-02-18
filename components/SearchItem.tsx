import {Image, Pressable, View} from "react-native";
import {useAndroidRipple, Text, Title} from "./Themed";
import {SearchDomain} from "../constants/api";
import {useNavigation} from "@react-navigation/native";
import Colors from "../constants/Colors";
import {MaterialIcons} from "@expo/vector-icons";
import * as React from "react";
import useColorScheme from "../hooks/useColorScheme";

export default function SearchItem({domain, title}: {domain: SearchDomain, title: string}) {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  return (
    <Pressable
      style={{ width: '100%', padding: 10, marginTop: 10 }}
      android_ripple={useAndroidRipple()}
      //onPress={() => navigation.navigate("SearchDetails", {body: data})}
    >
      <View style={{flexDirection: "row"}}>
        <MaterialIcons
          name={getDomainIcon(domain)}
          size={25}
          color={Colors[colorScheme].text}
          style={{marginRight: 15}}
        />
        <Text>{title}</Text>
      </View>
    </Pressable>
  )
}

function getDomainIcon(domain: SearchDomain) {
  switch (domain) {
    case "Authors":
      return "person";
    case "Tags":
      return "tag";
    case "Topics":
      return "category";  // or topic
  }
  return "help";
}
