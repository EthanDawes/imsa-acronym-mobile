import {Title, View, Text} from "../components/Themed";
import {RootStackScreenProps} from "../types";
import useAsync from "../hooks/useAsync";

export default function ArticleScreen({route}: RootStackScreenProps<"Article">) {
  const {body: article} = route.params;

  return (
    <View>
      <Title>{article.title}</Title>
    </View>
  );
}
