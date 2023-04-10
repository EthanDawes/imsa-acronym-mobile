import {Text, TextInput, useAndroidRipple} from "../components/Themed";
import {RootStackScreenProps} from "../types";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import InfiniteScroll from "../components/InfiniteScroll";
import {ListRenderItem, ListRenderItemInfo, View} from "react-native";
import {UserComment} from "../components/Article/logic";
import IconButton from "../components/IconButton";
import {submitComment} from "../constants/api";
import {useState} from "react";

const padding = 10;

export default function CommentsScreen({route, navigation}: RootStackScreenProps<"Comments">) {
  const {comments, articleId} = route.params;
  const [comment, setComment] = useState("");
  const colorScheme = Colors[useColorScheme()];
  const androidRipple = useAndroidRipple();

  return (
    <View style={{flex: 1}}>
      <InfiniteScroll
        iterator={comments}
        renderItem={Comment}
      />
      {articleId &&
        <View style={{flexDirection: "row"}}>
          <TextInput
            style={{flexGrow: 1}}
            placeholder="Add a comment..."
            onChangeText={setComment}
            value={comment}
          />
          <IconButton icon={"send"} action={() => submitComment(articleId, comment, navigation).then(success => success && setComment(""))} />
        </View>
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
