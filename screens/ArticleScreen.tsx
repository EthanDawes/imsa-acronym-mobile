import {CategoryLabel, RoundedButton, Text, Title, useAndroidRipple} from "../components/Themed";
import {RootStackScreenProps} from "../types";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import {Image, Linking, Platform, Pressable, ScrollView, View} from "react-native";
import {useState} from "react";
import ArticleImage from "../components/Article/ArticleImage";
import {decode} from "html-entities";
import AutoHeightWebView from "react-native-autoheight-webview";
import wp, {getAllPosts} from "../constants/api";
import * as WebBrowser from 'expo-web-browser';

const padding = 10;

export default function ArticleScreen({route, navigation}: RootStackScreenProps<"Article">) {
  const {body: article} = route.params;
  const colorScheme = Colors[useColorScheme()];
  const androidRipple = useAndroidRipple();
  // TODO: when this re-renders, posts will be fetched again. Convert to bound function & pass? (UseAsyncIterator will only call once, on init)
  const relatedPosts = useState(getAllPosts(wp.posts().embed().param({
    exclude: article.id,
    tax_relation: "OR",
    categories: Object.values(article.categories),
    tags: Object.values(article.tags),
  })))[0];

  const pronouns = article.author.description?.toLowerCase() ?? "";  // Author.description can be undefined, despite documentation's assurance
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

  // Adapted from https://stackoverflow.com/a/67409099 TODO: I don't think it's working
  const fontUrl = Platform.select({
    ios: "helvetica.ttf",
    android: "file:///android_asset/fonts/helvetica.ttf",
  });

  // TODO: am I opening myself up to XSS attacks by embedding a WebView?
  return (
    <ScrollView>
      <View style={{paddingHorizontal: padding}}>
        <View style={{flexDirection: "row"}}>
          {Object.entries(article.categories).map(([category, id]) => (
            <RoundedButton
              onPress={() => navigation.navigate("SearchDetails", {id, domain: "Topics", title: category})}
              color={"tint"}
              bold={true}
            >
              <CategoryLabel>{category}</CategoryLabel>
            </RoundedButton>
          ))}
        </View>
        <Title>{article.title}</Title>
        <RoundedButton
          onPress={() => navigation.navigate("SearchDetails", {id: article.author.id, domain: "Authors", title: article.author.name, img})}
          color={"text"}
        >
          <Text>{article.author.name}</Text>
        </RoundedButton>
        <ArticleImage src={article.imgUrl} />
        <Text>{new Date(article.date).toLocaleDateString(undefined, {dateStyle: "medium"})}</Text>
      </View>
      <AutoHeightWebView
        originWhitelist={['*']}
        viewportContent="width=device-width, initial-scale=1, user-scalable=no"
        customStyle={`
          @font-face {
            font-family: 'helvetica'; 
            src: local('helvetica') url('${fontUrl}') format('truetype');
          }
          p {
            padding: 0 ${padding}px;
            font-family: helvetica;
          }
          * {
           color: ${colorScheme.text};
          }
          a {
            color: ${colorScheme.tint};
          }
        `}
        source={{html: article.body, baseUrl: '' }}
        // Adapted from https://stackoverflow.com/a/54115883
        onShouldStartLoadWithRequest={event => {
          if (event.url.slice(0,4) === 'http') {
            //Linking.openURL(event.url);
            WebBrowser.openBrowserAsync(event.url);
            return false;
          }
          return true;
        }}
      />
      <View style={{paddingHorizontal: padding}}>
        {article.author.description &&
          <Pressable
            style={{flexDirection: "row", alignItems: "center", marginVertical: 10}}
            android_ripple={androidRipple}
            onPress={() => navigation.navigate("SearchDetails", {id: article.author.id, domain: "Authors", title: article.author.name, img})}
          >
            <Image style={{borderRadius: 1000, width: 96, height: 96}} source={{ uri: img }}
                   onError={() => getFakeFace(isFemale).then(setImg)}
            />
            <Text style={{flexShrink: 1, marginLeft: 5}}>{decode(article.author.description)}</Text>
          </Pressable>
        }
      </View>
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
