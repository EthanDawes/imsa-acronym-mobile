import {StyleSheet, Image, Pressable} from 'react-native';

import {androidRipple, Title} from '../Themed';
import {ArticleProps} from "./logic";
import ArticleFooter from "./ArticleFooter";


export default function LargeArticle({imgUrl, title, date, id, useBookmarks}: ArticleProps) {
  return (
    <Pressable style={styles.container} android_ripple={androidRipple()}>
      <Image
        style={styles.bigImg}
        source={{
          uri: imgUrl,
        }}
      />
      <Title>{title}</Title>
      <ArticleFooter date={date} id={id} useBookmarks={useBookmarks} />
    </Pressable>
  );
}

// TODO: more precise positioning besides "eyeballing it" (see tailwind?)
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  bigImg: {
    width: '100%',
    height: 200,
    borderRadius: 30,
  },
});
