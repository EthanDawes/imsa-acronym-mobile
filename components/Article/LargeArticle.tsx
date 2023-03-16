import {CategoryLabel, Text, Title} from '../Themed';
import {ArticleProps} from "./logic";
import ArticleContainer from "./ArticleContainer";
import ArticleImage from "./ArticleImage";
import useColorScheme from "../../hooks/useColorScheme";
import Colors from "../../constants/Colors";


export default function LargeArticle(props: ArticleProps) {
  const {imgUrl, title, excerpt, categories} = props.data;
  return (
    <ArticleContainer {...props}>
      <ArticleImage src={imgUrl} />
      <CategoryLabel>{Object.keys(categories).join(", ")}</CategoryLabel>
      <Title>{title}</Title>
      <Text>{excerpt}</Text>
    </ArticleContainer>
  );
}
