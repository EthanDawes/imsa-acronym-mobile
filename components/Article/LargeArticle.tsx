import {StyleSheet, Image, Pressable} from 'react-native';

import {useAndroidRipple, Title} from '../Themed';
import {ArticleProps} from "./logic";
import ArticleContainer from "./ArticleContainer";
import ArticleImage from "./ArticleImage";


export default function LargeArticle(props: ArticleProps) {
  const {imgUrl, title, id} = props.data;
  return (
    <ArticleContainer {...props}>
      <ArticleImage src={imgUrl} id={id} />
      <Title>{title}</Title>
    </ArticleContainer>
  );
}
