import {StyleSheet, Image, Pressable} from 'react-native';

import {androidRipple, Title} from '../Themed';
import {ArticleProps} from "./logic";
import ArticleContainer from "./ArticleContainer";


export default function LargeArticle(props: ArticleProps) {
  const {imgUrl, title} = props.data;
  return (
    <ArticleContainer {...props}>
      <Image
        style={styles.bigImg}
        source={{
          uri: imgUrl,
        }}
      />
      <Title>{title}</Title>
    </ArticleContainer>
  );
}

// TODO: more precise positioning besides "eyeballing it" (see tailwind?)
const styles = StyleSheet.create({
  bigImg: {
    width: '100%',
    height: 200,
    borderRadius: 30,
  },
});
