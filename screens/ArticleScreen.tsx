import {
  CategoryLabel,
  Hr,
  RoundedButton,
  Text,
  TextInput,
  Title,
  useAndroidRipple,
} from "../components/Themed";
import { RootStackScreenProps } from "../types";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import ArticleImage from "../components/Article/ArticleImage";
import { decode } from "html-entities";
import AutoHeightWebView from "react-native-autoheight-webview";
import wp, {
  formatComment,
  getAllPosts,
  getPostComments,
  submitComment,
} from "../constants/api";
import * as WebBrowser from "expo-web-browser";
import { MaterialIcons } from "@expo/vector-icons";
import * as React from "react";
import { getDomainIcon } from "../components/SearchItem";
import useAsyncStorage from "../hooks/useAsyncStorage";
import useAsyncIterator from "../hooks/useAsyncIterator";
import IconButton from "../components/IconButton";
import useAsync from "../hooks/useAsync";
import * as WPTYPES from "wp-types";
import { SizeContext } from "../constants/context";
import Layout from "../constants/Layout";

const padding = 10;

export default function ArticleScreen({
  route,
  navigation,
}: RootStackScreenProps<"Article">) {
  const { body: article } = route.params;
  const colorScheme = Colors[useColorScheme()];
  const androidRipple = useAndroidRipple();
  const [isLoading, setIsLoading] = useState(true);
  const { item: fontSize } = useContext(SizeContext);

  // Gravitar documentation: https://en.gravatar.com/site/implement/images/
  const img = article.author.avatar_urls?.["96"]?.replace(
    /(?:d|default)=[^&]+/,
    "d=mp"
  );

  // Adapted from https://stackoverflow.com/a/67409099 TODO: I don't think it's working
  const fontUrl = Platform.select({
    ios: "Lora.ttf",
    android: "file:///android_asset/fonts/Lora.ttf",
  });

  // TODO: am I opening myself up to XSS attacks by embedding a WebView?
  return (
    <ScrollView>
      <View
        style={{ paddingHorizontal: padding, paddingVertical: 17, gap: 17 }}
        key="header"
      >
        <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
          {Object.entries(article.categories).map(([topic, id]) => (
            <Pressable
              onPress={() =>
                navigation.navigate("SearchDetails", {
                  id,
                  domain: "Topics",
                  title: topic,
                })
              }
              key={id}
            >
              <CategoryLabel style={{ fontSize: 15 + fontSize }}>
                {topic}
              </CategoryLabel>
            </Pressable>
          ))}
          {Object.entries(article.tags).map(([category, id]) => (
            <Pressable
              onPress={() =>
                navigation.navigate("SearchDetails", {
                  id,
                  domain: "Tags",
                  title: category,
                })
              }
              key={id}
            >
              <CategoryLabel style={{ fontSize: 15 + fontSize }}>
                #{category}
              </CategoryLabel>
            </Pressable>
          ))}
        </View>
        <Title>{article.title + (__DEV__ ? ` (${article.id})` : "")}</Title>
        <RoundedButton
          onPress={() =>
            navigation.navigate("SearchDetails", {
              id: article.author.id,
              domain: "Authors",
              title: article.author.name,
              img,
            })
          }
          color={"text"}
        >
          <MaterialIcons
            name={getDomainIcon("Authors")}
            size={25}
            color={colorScheme.text}
            style={{ marginRight: 15 }}
          />
          <Text>{article.author.name}</Text>
        </RoundedButton>
        <ArticleImage src={article.imgUrl} />
        <Text style={{ color: colorScheme.shadow }}>{article.imgCaption}</Text>
        <Text style={{ marginTop: -15 }}>
          {new Date(article.date).toLocaleDateString(undefined, {
            dateStyle: "medium",
          })}
        </Text>
      </View>
      <AutoHeightWebView
        key="body"
        scrollEnabled={false}
        originWhitelist={["*"]}
        // This should fix crash on Android https://github.com/react-native-webview/react-native-webview/issues/811
        style={{ opacity: 0.99 }}
        viewportContent="width=device-width, initial-scale=1, user-scalable=no"
        customStyle={`
          @font-face {
            font-family: 'Lora'; 
            src: local('Lora') url('${fontUrl}') format('truetype');
          }
          p {
            font-size: ${12 + fontSize}pt;
          }
          h1, h2, h3, h4, h5, h6, p {
            /* This can't be applied to :root b/c it will cause collapse */
            padding: 0 ${padding}px;
          }
          * {
           font-family: Lora;
           font-weight: 100;
           color: ${colorScheme.text};
           max-width: 100%;
           height: auto;
          }
          a {
            color: ${colorScheme.tint};
          }
          img {
            /* This would be ideal, but it no work width: 100vw; */
            margin-left: 50vw;
            transform: translateX(-50%);
          }
        `}
        source={{ html: article.body, baseUrl: "" }}
        // Adapted from https://stackoverflow.com/a/54115883
        onShouldStartLoadWithRequest={(event) => {
          if (event.url.slice(0, 4) === "http") {
            //Linking.openURL(event.url);
            WebBrowser.openBrowserAsync(event.url);
            return false;
          }
          return true;
        }}
        onLoad={() => setIsLoading(false)}
      />
      {!isLoading && (
        <View
          style={{ paddingHorizontal: padding, marginBottom: padding }}
          key="footer"
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Hr style={{ flexGrow: 1 }} />
            <Image
              style={{ margin: 20 }}
              source={require("../assets/images/favicon.png")}
            />
            <Hr style={{ flexGrow: 1 }} />
          </View>
          <Comments articleId={article.id} navigation={navigation} />
          {article.author.description && (
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 10,
                gap: 10,
              }}
              android_ripple={androidRipple}
              onPress={() =>
                navigation.navigate("SearchDetails", {
                  id: article.author.id,
                  domain: "Authors",
                  title: article.author.name,
                  img,
                })
              }
            >
              <Image
                style={{ borderRadius: 1000, width: 96, height: 96 }}
                source={{ uri: img }}
              />
              <Text style={{ flexShrink: 1 }}>
                {decode(article.author.description)}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </ScrollView>
  );
}

function Comments({
  articleId,
  navigation,
}: {
  articleId: number;
  navigation: RootStackScreenProps<"Article">["navigation"];
}) {
  const colorScheme = Colors[useColorScheme()];
  const [comment, setComment] = useState("");
  const defaultComment = useAsync(
    () =>
      (
        wp
          .comments()
          .perPage(1)
          .param("post", articleId)
          .get() as Promise<WPTYPES.WP_REST_API_Comments>
      ).then((comments) => comments.length > 0 && formatComment(comments[0])),
    false
  );

  return (
    <Pressable
      style={{
        height: 100,
        borderRadius: 10,
        padding,
        backgroundColor: colorScheme.header,
      }}
      android_ripple={useAndroidRipple()}
      onPress={() => navigation.navigate("Comments", { articleId })}
      disabled={!defaultComment}
    >
      <Title>Comments</Title>
      <View
        style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}
      >
        {defaultComment && (
          <>
            <Image
              style={{ width: 35, height: 35, borderRadius: 1000 }}
              source={{ uri: defaultComment.imgUrl }}
            />
            <Text style={{ flex: 1 }}>{defaultComment.body}</Text>
          </>
        )}
        {!defaultComment && (
          <View style={{ flex: 1, marginTop: 8 }}>
            <TextInput
              placeholder="No comments yet. Be the first!"
              onChangeText={setComment}
              value={comment}
              multiline={true}
              style={{ width: "100%" }}
            />
          </View>
        )}
        <IconButton
          icon={defaultComment ? "angle-down" : "send"}
          size={24}
          disabled={!!defaultComment}
          action={() =>
            submitComment(articleId, comment, navigation).then(
              (success) => success && setComment("")
            )
          }
        />
      </View>
    </Pressable>
  );
}
