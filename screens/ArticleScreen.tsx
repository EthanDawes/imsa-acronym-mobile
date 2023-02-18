import {Title, View, Text, useAndroidRipple} from "../components/Themed";
import {RootStackScreenProps} from "../types";
import useAsync from "../hooks/useAsync";
import WebView from "react-native-webview";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import {Image, Pressable, ScrollView} from "react-native";
import {useState} from "react";
import {WebViewMessageEvent} from "react-native-webview/lib/WebViewTypes";
import ArticleImage from "../components/Article/ArticleImage";
import {decode} from "html-entities";

export default function ArticleScreen({route}: RootStackScreenProps<"Article">) {
  const {body: article} = route.params;
  const colorScheme = Colors[useColorScheme()];
  const androidRipple = useAndroidRipple();

  const pronouns = article.author.description.toLowerCase();
  const isMale = hasWord(pronouns, "he") || hasWord(pronouns, "his") || hasWord(pronouns, "him") || pronouns.includes("boy") || pronouns.includes("04") || pronouns.includes("05");
  const isFemale = hasWord(pronouns, "she") || hasWord(pronouns, "hers") || hasWord(pronouns, "her") || pronouns.includes("girl") || pronouns.includes("02") || pronouns.includes("06");
  console.log(isFemale, isMale);
  const [img, setImg] = useState(() => {
    /* Unfortunately, React Native doesn't support URLSearchParams.set so I must use janky RegEx solution :/
    const url = new URL(article.author.avatar_urls?.["96"]);
    url.searchParams.set("d", "404");
    return url.href;*/
    // Make Gravitar return 404 instead of default so I can detect & replace with fake person
    // Docs: https://en.gravatar.com/site/implement/images/
    const img = article.author.avatar_urls?.["96"];
    if (isFemale === isMale)  // Could not reliably determine author's gender
      return img;
    return img?.replace(/(?:d|default)=[^&]+/, "d=404");
  });

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
      <View style={{flexDirection: "row"}}>
        {Object.entries(article.categories).map(([category, id]) => (
          <Pressable android_ripple={androidRipple}>
            <Text>{category}</Text>
          </Pressable>
        ))}
      </View>
      <Title>{article.title}</Title>
      <Text>{article.author.name}</Text>
      <ArticleImage src={article.imgUrl} />
      <Text>{article.date.toLocaleDateString(undefined, {dateStyle: "medium"})}</Text>
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
      {article.author.description &&
        <Pressable
          style={{flexDirection: "row", alignItems: "center", marginVertical: 10}}
          android_ripple={androidRipple}
        >
          <Image style={{borderRadius: 1000, width: 96, height: 96}} source={{ uri: img }}
                 onError={() => getFakeFace(isFemale).then(setImg)}
          />
          <Text style={{flexShrink: 1, marginLeft: 5}}>{decode(article.author.description)}</Text>
        </Pressable>
      }
    </ScrollView>
  );
}

/**
 * @return URL of the fake face
 */
function getFakeFace(isFemale: boolean) {
  return fetch(`https://fakeface.rest/face/json?gender=${isFemale ? "female" : "male"}&minimum_age=17&maximum_age=21`)
    .then(res => res.json().catch(() => res.text().then(console.log)))
    .then(res => res.image_url as string)
}

/**
 * Check if a sentence contains a word, applying extra logic to ensure that the search term isn't part of a larger word
 */
function hasWord(sentence: string, word: string) {
  return new RegExp(`(?<!\\w)${word}(?!\\w)`).test(sentence);
}
