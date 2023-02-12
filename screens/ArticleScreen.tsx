import {View} from "../components/Themed";
import {RootStackScreenProps} from "../types";
import useAsync from "../hooks/useAsync";

export default function ArticleScreen({route}: RootStackScreenProps<"Article">) {
  const {body: bodyPromise} = route.params;
  const body = useAsync(bodyPromise);

  return (
    <View>

    </View>
  );
}
