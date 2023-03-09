import {RootStackScreenProps} from "../types";
import WebView from "react-native-webview";

export default function WebBrowser({route, navigation}: RootStackScreenProps<"WebBrowser">) {
  const {url, title} = route.params;
  navigation.setOptions({title});
  return (
    <WebView
      source={{uri: url}}
    />
  )
}
