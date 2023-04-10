// 'any' isn't great, but I'm only using this twice so who cares?
import {Pressable} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import * as React from "react";
import useColorScheme from "../hooks/useColorScheme";

export default function IconButton({icon, action, size=25, disabled=false}: {icon: MaterialIconName, action: () => void, size?: number, disabled?: boolean}) {
  const colorScheme = useColorScheme();
  return (
    <Pressable
      onPress={action}
      android_ripple={{color: Colors[colorScheme].shadow, borderless: true, foreground: true, radius: 25}}
      disabled={disabled}
    >
      <FontAwesome
        name={icon}
        size={size}
        color={Colors[colorScheme].text}
        style={{marginRight: 15, marginLeft: 15}}
      />
    </Pressable>
  )
}
