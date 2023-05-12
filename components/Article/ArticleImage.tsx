import {Image, StyleSheet} from "react-native";
import Layout from "../../constants/Layout";

// TODO: wrap in shared element for aesthetic transitions
export default function ArticleImage({src}: {src: string}) {
  return (
    <Image
      style={[styles.bigImg, {marginHorizontal: -20, width: Layout.window.width, borderRadius: 0}]}
      source={{
        uri: src,
      }}
    />
  )
}

// TODO: more precise positioning besides "eyeballing it" (see tailwind?)
const styles = StyleSheet.create({
  bigImg: {
    width: '100%',
    height: 300,
    borderRadius: 30,
  },
});
