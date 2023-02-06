// 'any' isn't great, but I'm only using this twice so who cares?
import {RootTabParamList, RootTabScreenProps} from "../types";
import {Pressable} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import * as React from "react";
import useColorScheme from "../hooks/useColorScheme";

export default function IconButton({icon, action}: {icon: MaterialIconName, action: () => void}) {
  const colorScheme = useColorScheme();
  return (
    <Pressable
      onPress={action}
      android_ripple={{color: Colors[colorScheme].shadow, borderless: true, foreground: true, radius: 25}}
    >
      <FontAwesome
        name={icon}
        size={25}
        color={Colors[colorScheme].text}
        style={{marginRight: 15, marginLeft: 15}}
      />
    </Pressable>
  )
}
