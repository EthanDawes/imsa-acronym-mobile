import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';

import { Hr } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import React from "react";
import LargeArticle from "../components/Article/LargeArticle";
import Layout from "../constants/Layout";

export default function FeedScreen({ navigation }: RootTabScreenProps<'FeedTab'>) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // TODO: I should probably use a FlatList b/c that doesn't render all elements at once
  return (
    <ScrollView
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
    </ScrollView>
  );
}

function AllArticles() {
  //
}
