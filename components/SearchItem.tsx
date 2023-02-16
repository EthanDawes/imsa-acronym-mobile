import {Pressable, View} from "react-native";
import {androidRipple} from "./Themed";

export default function SearchItem(domain: string, ) {
  return (
    <Pressable style={{flexDirection: "row"}} android_ripple={androidRipple()}>

    </Pressable>
  )
}
