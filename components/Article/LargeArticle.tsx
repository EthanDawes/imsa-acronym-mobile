import {Text, Title} from '../Themed';
import {ArticleProps} from "./logic";
import ArticleContainer from "./ArticleContainer";
import ArticleImage from "./ArticleImage";


export default function LargeArticle(props: ArticleProps) {
  const {imgUrl, title, excerpt} = props.data;
  return (
    <ArticleContainer {...props}>
      <ArticleImage src={imgUrl} />
      <Title>{title}</Title>
      <Text>{excerpt}</Text>
    </ArticleContainer>
  );
}
