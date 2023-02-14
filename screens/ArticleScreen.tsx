import {Title, View, Text} from "../components/Themed";
import {RootStackScreenProps} from "../types";
import useAsync from "../hooks/useAsync";
import WebView from "react-native-webview";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import {ScrollView} from "react-native";
import {useState} from "react";
import {WebViewMessageEvent} from "react-native-webview/lib/WebViewTypes";

export default function ArticleScreen({route}: RootStackScreenProps<"Article">) {
  const {body: article} = route.params;
  const colorScheme = Colors[useColorScheme()];

  // Adapted from https://yelotofu.com/reactnative-why-your-webview-disappears-inside-scrollview-c6057c9ac6dd
  const [webViewHeight, setWebViewHeight] = useState(0);
  const onMessage = (event: WebViewMessageEvent) => {
    setWebViewHeight(Number.parseInt(event.nativeEvent.data));
  }
  const injectedJavaScript=`
  window.ReactNativeWebView.postMessage(
    Math.max(document.body.offsetHeight, document.body.scrollHeight)
  );`;

  // TODO: am I opening myself up to XSS attacks by embedding a WebView?
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, height: webViewHeight }}>
      <Title>{article.title}</Title>
      <Text>{article.date.getTime()}</Text>
      <WebView
        originWhitelist={['*']}
        scrollEnabled={false}
        onMessage={onMessage}
        injectedJavaScript={injectedJavaScript}
        source={{html:
`<style>
* {
 color: ${colorScheme.text};
 background-color: ${colorScheme.background};
}
a {
  color: ${colorScheme.tint};
}
</style>
`
          + '<meta name="viewport" content="width=device-width, initial-scale=1" />'
          + article.body
        }}
      />
    </ScrollView>
  );
}
