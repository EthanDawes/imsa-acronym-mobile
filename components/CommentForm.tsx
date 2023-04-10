import {TextInput} from "./Themed";
import IconButton from "./IconButton";
import {submitComment} from "../constants/api";
import {StyleProp, View, ViewStyle} from "react-native";
import {useState} from "react";
import {useNavigation} from "@react-navigation/native";

export default function CommentForm({articleId, containerStyle}: {articleId: number, containerStyle?: StyleProp<ViewStyle>}) {
  const [comment, setComment] = useState("");
  const navigation = useNavigation();

  return (
    <View style={[{flexDirection: "row"}, containerStyle]}>
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
