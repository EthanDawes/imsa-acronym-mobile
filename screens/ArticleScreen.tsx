import {CategoryLabel, Hr, RoundedButton, Text, TextInput, Title, useAndroidRipple} from "../components/Themed";
import {RootStackScreenProps} from "../types";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import {Image, Linking, Platform, Pressable, ScrollView, View} from "react-native";
import {useEffect, useState} from "react";
import ArticleImage from "../components/Article/ArticleImage";
import {decode} from "html-entities";
import AutoHeightWebView from "react-native-autoheight-webview";
import wp, {formatComment, getAllPosts, getPostComments, submitComment} from "../constants/api";
import * as WebBrowser from 'expo-web-browser';
import {MaterialIcons} from "@expo/vector-icons";
import * as React from "react";
import {getDomainIcon} from "../components/SearchItem";
import useAsyncStorage from "../hooks/useAsyncStorage";
import useAsyncIterator from "../hooks/useAsyncIterator";
import IconButton from "../components/IconButton";
import useAsync from "../hooks/useAsync";
import * as WPTYPES from "wp-types";

const padding = 10;

export default function ArticleScreen({route, navigation}: RootStackScreenProps<"Article">) {
  const {body: article} = route.params;
  const colorScheme = Colors[useColorScheme()];
  const androidRipple = useAndroidRipple();
  const [isLoading, setIsLoading] = useState(true);
  const {item: fontSize} = useAsyncStorage("fontSize", 12);

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
      <View style={{paddingHorizontal: padding, paddingVertical: 17, gap: 17}} key="header">
        <View style={{flexDirection: "row", gap: 10, flexWrap: "wrap"}}>
          {Object.entries(article.categories).map(([topic, id]) => (
            <Pressable
              onPress={() => navigation.navigate("SearchDetails", {id, domain: "Topics", title: topic})}
              key={id}
            >
              <CategoryLabel style={{fontSize: 15}}>{topic}</CategoryLabel>
            </Pressable>
          ))}
          {Object.entries(article.tags).map(([category, id]) => (
            <Pressable
              onPress={() => navigation.navigate("SearchDetails", {id, domain: "Tags", title: category})}
              key={id}
            >
              <CategoryLabel style={{fontSize: 15}}>#{category}</CategoryLabel>
            </Pressable>
          ))}
        </View>
        <Title>{article.title + (__DEV__ ? ` (${article.id})` : "")}</Title>
        <RoundedButton
          onPress={() => navigation.navigate("SearchDetails", {id: article.author.id, domain: "Authors", title: article.author.name, img})}
          color={"text"}
        >
          <MaterialIcons
            name={getDomainIcon("Authors")}
            size={25}
            color={colorScheme.text}
            style={{marginRight: 15}}
          />
          <Text>{article.author.name}</Text>
        </RoundedButton>
        <ArticleImage src={article.imgUrl} />
        <Text style={{color: colorScheme.shadow}}>{article.imgCaption}</Text>
        <Text style={{marginTop: -15}}>{new Date(article.date).toLocaleDateString(undefined, {dateStyle: "medium"})}</Text>
      </View>
      <AutoHeightWebView
        key="body"
        scrollEnabled={false}
        originWhitelist={['*']}
        // This should fix crash on Android https://github.com/react-native-webview/react-native-webview/issues/811
        style={{opacity: 0.99}}
        viewportContent="width=device-width, initial-scale=1, user-scalable=no"
        customStyle={`
          @font-face {
            font-family: 'helvetica'; 
            src: local('helvetica') url('${fontUrl}') format('truetype');
          }
          p {
            font-size: ${fontSize}pt;
          }
          h1, h2, h3, h4, h5, h6, p {
            /* This can't be applied to :root b/c it will cause collapse */
            padding: 0 ${padding}px;
          }
          * {
           font-family: helvetica;
           color: ${colorScheme.text};
           max-width: 100%;
           height: auto;
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
        onLoad={() => setIsLoading(false)}
      />
      {!isLoading &&
        <View style={{paddingHorizontal: padding, marginBottom: padding}} key="footer">
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Hr style={{flexGrow: 1}} />
            <Image style={{margin: 20}} source={require('../assets/images/favicon.png')} />
            <Hr style={{flexGrow: 1}} />
          </View>
          <Comments articleId={article.id} navigation={navigation} />
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
      }
    </ScrollView>
  );
}

function Comments({articleId, navigation}: {articleId: number, navigation: RootStackScreenProps<"Article">["navigation"]}) {
  const colorScheme = Colors[useColorScheme()];
  const [comment, setComment] = useState("");
  const defaultComment = useAsync(() =>
    (wp.comments().perPage(1).param("post", articleId).get() as Promise<WPTYPES.WP_REST_API_Comments>)
      .then(comments => comments.length > 0 && formatComment(comments[0])),
    false);

  return (
    <Pressable
      style={{height: 100, borderRadius: 10, padding, backgroundColor: colorScheme.header}}
      android_ripple={useAndroidRipple()}
      onPress={() => navigation.navigate("Comments", {articleId})}
      disabled={!defaultComment}
    >
      <Title>Comments</Title>
        <View style={{flex: 1, flexDirection: "row", alignItems: "center", gap: 10}}>
          {defaultComment &&
            <>
              <Image style={{width: 35, height: 35, borderRadius: 1000}} source={{uri: defaultComment.imgUrl}} />
              <Text style={{flex: 1}}>{defaultComment.body}</Text>
            </>
          }
          {!defaultComment &&
            <View style={{flex: 1, marginTop: 8}}>
              <TextInput
                placeholder="No comments yet. Be the first!"
                onChangeText={setComment}
                value={comment}
                multiline={true}
                style={{width: "100%"}}
              />
            </View>
          }
          <IconButton
            icon={defaultComment ? "angle-down" : "send"}
            size={24}
            disabled={!!defaultComment}
            action={() => submitComment(articleId, comment, navigation).then(success => success && setComment(""))}
          />
        </View>
    </Pressable>
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
