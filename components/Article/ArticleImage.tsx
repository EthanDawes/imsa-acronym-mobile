import {Image, StyleSheet} from "react-native";
import {SharedElement} from "react-navigation-shared-element";

// TODO: wrap in shared element for aesthetic transitions
export default function ArticleImage({src, id}: {src: string, id: number}) {
  return (
    <SharedElement id={`article.${id}.photo`}>
      <Image
        style={styles.bigImg}
        source={{
          uri: src,
        }}
      />
    </SharedElement>
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
