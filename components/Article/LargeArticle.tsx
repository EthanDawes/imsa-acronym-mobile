import {StyleSheet, Image, View, Button} from 'react-native';

import {Text, Title} from '../Themed';
import IconButton from "../IconButton";
import {ArticleProps} from "./logic";
import ArticleFooter from "./ArticleFooter";


export default function LargeArticle({imgUrl, title, date}: ArticleProps) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.bigImg}
        source={{
          uri: imgUrl,
        }}
      />
      <Title>{title}</Title>
      <ArticleFooter date={date} />
    </View>
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
