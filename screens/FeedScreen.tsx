import {RefreshControl, ScrollView, StyleSheet, View, Animated} from 'react-native';

import { Hr } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import React from "react";
import LargeArticle from "../components/Article/LargeArticle";
import Layout from "../constants/Layout";
import {useCollapsibleHeader} from "react-navigation-collapsible";
import {DefaultTheme, DarkTheme} from '@react-navigation/native';
import useColorScheme from "../hooks/useColorScheme";
import useAsyncIterator from "../hooks/useAsyncIterator";
import {getAllPosts} from "../constants/api";

export default function FeedScreen({ navigation }: RootTabScreenProps<'FeedTab'>) {
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const [articles, next] = useAsyncIterator(getAllPosts());

  const options = {
    navigationOptions: {
      headerStyle: { backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card },
    },
  };
  const {
    onScroll /* Event handler */,
    containerPaddingTop /* number */,
    scrollIndicatorInsetTop /* number */,
  } = useCollapsibleHeader(options);
  // CollapsibleHeader docs: https://github.com/benevbright/react-navigation-collapsible

  // TODO: I should probably use a FlatList b/c that doesn't render all elements at once
  return (
    <Animated.FlatList
      onScroll={onScroll}
      contentContainerStyle={{ paddingTop: containerPaddingTop }}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      data={articles}
      renderItem={({item}) => <LargeArticle imgUrl={item._links["wp:featuredmedia"].href} title={item.title.rendered} date={new Date(item.date)} />}
      keyExtractor={item => "" + item.id}
    />
  );
}
