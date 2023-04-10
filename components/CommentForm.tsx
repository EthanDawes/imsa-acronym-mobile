import {TextInput} from "./Themed";
import IconButton from "./IconButton";
import {submitComment} from "../constants/api";
import {View} from "react-native";
import {useState} from "react";
import {useNavigation} from "@react-navigation/native";

export default function CommentForm({articleId}: {articleId: number}) {
  const [comment, setComment] = useState("");
  const navigation = useNavigation();

  return (
    <View style={{flexDirection: "row"}}>
      <TextInput
        style={{flexGrow: 1}}
        placeholder="Add a comment..."
        onChangeText={setComment}
        value={comment}
      />
      <IconButton icon={"send"} action={() => submitComment(articleId, comment, navigation).then(success => success && setComment(""))} />
    </View>
  );
}
