import {RefreshControl, ScrollView, StyleSheet, View, Animated} from 'react-native';

import { Hr } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import React from "react";
import LargeArticle from "../components/Article/LargeArticle";
import Layout from "../constants/Layout";
import {useCollapsibleHeader} from "react-navigation-collapsible";
import {DefaultTheme, DarkTheme} from '@react-navigation/native';
import useColorScheme from "../hooks/useColorScheme";

// The docs say I need to disable the translucent status bar, but I haven't had any problems (yet)
// https://github.com/benevbright/react-navigation-collapsible
export default function FeedScreen({ navigation }: RootTabScreenProps<'FeedTab'>) {
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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

  // TODO: I should probably use a FlatList b/c that doesn't render all elements at once
  return (
    <Animated.ScrollView
      onScroll={onScroll}
      contentContainerStyle={{ paddingTop: containerPaddingTop }}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={Layout.styles.scrollView}>
        <LargeArticle imgUrl="https://reactnative.dev/img/tiny_logo.png" title={"Headline 1"} date={new Date()} />
        <Hr />
        <LargeArticle imgUrl="https://reactnative.dev/img/tiny_logo.png" title={"Headline 1"} date={new Date()} />
        <Hr />
        <LargeArticle imgUrl="https://reactnative.dev/img/tiny_logo.png" title={"Headline 1"} date={new Date()} />
        <Hr />
        <LargeArticle imgUrl="https://reactnative.dev/img/tiny_logo.png" title={"Headline 1"} date={new Date()} />
        <Hr />
        <LargeArticle imgUrl="https://reactnative.dev/img/tiny_logo.png" title={"Headline 1"} date={new Date()} />
        <Hr />
        <LargeArticle imgUrl="https://reactnative.dev/img/tiny_logo.png" title={"Headline 1"} date={new Date()} />
        <Hr />
      </View>
    </Animated.ScrollView>
  );
}

function AllArticles() {
  //
}
