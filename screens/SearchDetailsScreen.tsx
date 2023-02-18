import {RootStackScreenProps} from "../types";
import {Animated, FlatList} from "react-native";
import useAsyncIterator from "../hooks/useAsyncIterator";
import wp, {ArticleFilter, getAllPosts} from "../constants/api";
import React, {useEffect} from "react";
import LargeArticle from "../components/Article/LargeArticle";
import SmallArticle from "../components/Article/SmallArticle";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useCollapsibleHeader} from "react-navigation-collapsible";
import constructInfiniteScrollHandler from "../components/constructInfiniteScrollHandler";
import useColorScheme from "../hooks/useColorScheme";

export function SearchDetailsScreen({route}: RootStackScreenProps<"SearchDetails">) {
  const {domain, id} = route.params;
  const colorScheme = useColorScheme();
  const [articles, next] = useAsyncIterator(getAllPosts(wp.posts().param({[getDomainSearchParam(domain)]: id}).perPage(50)));
  // TODO: consolidate duplicated code into InfinateScroll component
  useEffect(() => {
    for (let i=0; i<10; i++) next();
  }, []);

  const options = {
    navigationOptions: {
      headerStyle: { backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card },
    },
  };
  const {
    onScrollWithListener /* Event handler creator */,
    containerPaddingTop /* number */,
    scrollIndicatorInsetTop /* number */,
  } = useCollapsibleHeader(options);

  const onScroll = onScrollWithListener(constructInfiniteScrollHandler(next));

  return (
    <FlatList
      // onScroll={onScroll}
      // contentContainerStyle={{ paddingTop: containerPaddingTop }}
      // scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
      data={articles}
      renderItem={({item}) => <SmallArticle data={item} />}
      keyExtractor={item => "" + item.id}
    />
  );
}

function getDomainSearchParam(domain: ArticleFilter) {
  switch (domain) {
    case "Authors":
      return "author";
    case "Tags":
      return "tags";
    case "Topics":
      return "categories";
  }
}
