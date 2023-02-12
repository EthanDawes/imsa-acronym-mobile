import {RefreshControl, ScrollView, StyleSheet, View, Animated} from 'react-native';

import { Hr } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import React, {useEffect} from "react";
import LargeArticle from "../components/Article/LargeArticle";
import Layout from "../constants/Layout";
import {useCollapsibleHeader} from "react-navigation-collapsible";
import {DefaultTheme, DarkTheme} from '@react-navigation/native';
import useColorScheme from "../hooks/useColorScheme";
import useAsyncIterator from "../hooks/useAsyncIterator";
import wp, {getAllPosts} from "../constants/api";
import {useBookmarks} from "../components/Article/logic";

export default function FeedScreen({ navigation }: RootTabScreenProps<'FeedTab'>) {
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const usedBookmarks = useBookmarks();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const [articles, next] = useAsyncIterator(getAllPosts(wp.posts().perPage(50)));
  // Load the first 10 articles b/c waiting for all images Promise.all is too long. Images get queued right away
  useEffect(() => {
    for (let i=0; i<10; i++) next();
  }, []);

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

  // TODO: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. {"contentLength": 11827.4287109375, "dt": 831, "prevDt": 807}
  return (
    <Animated.FlatList
      onScroll={onScroll}
      contentContainerStyle={{ paddingTop: containerPaddingTop }}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      data={articles}
      renderItem={({item}) => <LargeArticle data={item} useBookmarks={usedBookmarks} />}
      keyExtractor={item => "" + item.id}
    />
  );
}
