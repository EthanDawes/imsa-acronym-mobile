import {Pressable, View} from "react-native";
import {Text, useAndroidRipple} from "./Themed";
import {ArticleFilter} from "../constants/api";
import {useNavigation} from "@react-navigation/native";
import Colors from "../constants/Colors";
import {MaterialIcons} from "@expo/vector-icons";
import * as React from "react";
import useColorScheme from "../hooks/useColorScheme";
import {useContext} from "react";
import {SubscriptionsContext} from "../constants/context";

export default function SearchItem(props: {domain: ArticleFilter, title: string, id: number, img?: string, addNotifications?: boolean}) {
  const {domain, title, addNotifications, id} = props;
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [subscriptions, toggleSubscriptions] = useContext(SubscriptionsContext);

  return (
    <Pressable
      style={{ width: '100%', padding: 10, marginTop: 10 }}
      android_ripple={useAndroidRipple()}
      onPress={() => addNotifications ? toggleSubscriptions(props) : navigation.navigate("SearchDetails", props)}
    >
      <View style={{flexDirection: "row"}}>
        <MaterialIcons
          name={getDomainIcon(domain)}
          size={25}
          color={Colors[colorScheme].text}
          style={{marginRight: 15}}
        />
        <Text style={{flexGrow: 1}}>{title}</Text>
        <MaterialIcons
          name={id in subscriptions ? "notifications" : "notifications-none"}
          size={25}
          color={Colors[colorScheme].text}
        />
      </View>
    </Pressable>
  )
}

export function getDomainIcon(domain: ArticleFilter) {
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
