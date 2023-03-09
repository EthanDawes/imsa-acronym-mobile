import {Image, StyleSheet} from "react-native";

// TODO: wrap in shared element for aesthetic transitions
export default function ArticleImage({src}: {src: string}) {
  return (
    <Image
      style={styles.bigImg}
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
    height: 200,
    borderRadius: 30,
  },
});
