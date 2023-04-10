import {Text} from "../components/Themed";
import {RootStackScreenProps} from "../types";
import InfiniteScroll from "../components/InfiniteScroll";
import {ListRenderItemInfo, View} from "react-native";
import {UserComment} from "../components/Article/logic";
import CommentForm from "../components/CommentForm";

export default function CommentsScreen({route, navigation}: RootStackScreenProps<"Comments">) {
  const {comments, articleId} = route.params;

  return (
    <View style={{flex: 1}}>
      <InfiniteScroll
        iterator={comments}
        renderItem={Comment}
      />
      {articleId &&
        <CommentForm articleId={articleId} />
      }
    </View>
  );
}

function Comment({item: comment}: ListRenderItemInfo<UserComment>) {
  return (
    <View>
      <Text>{comment.body}</Text>
    </View>
  )
}
