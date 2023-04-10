import {useAndroidRipple} from "../components/Themed";
import {RootStackScreenProps} from "../types";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import InfiniteScroll from "../components/InfiniteScroll";
import {View} from "react-native";

const padding = 10;

export default function CommentsScreen({route, navigation}: RootStackScreenProps<"Comments">) {
  const {comments, articleId} = route.params;
  const colorScheme = Colors[useColorScheme()];
  const androidRipple = useAndroidRipple();
  return (
    <InfiniteScroll
      iterator={comments}
      renderItem={Comment}
    />
  );
}

function Comment() {
  return (
    <View>

    </View>
  )
}
