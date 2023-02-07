import {RefreshControl, ScrollView, StyleSheet} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import {Hr, Text, View} from '../components/Themed';
import SmallArticle from "../components/Article/SmallArticle";
import React from "react";
import Layout from "../constants/Layout";

export default function SavedScreen() {
  return (
    <ScrollView>
      <View style={Layout.styles.scrollView}>
        <SmallArticle imgUrl="https://reactnative.dev/img/tiny_logo.png" title={"Headline 1"} date={new Date()} />
        <Hr />
        <SmallArticle imgUrl="https://reactnative.dev/img/tiny_logo.png" title={"Headline 1"} date={new Date()} />
        <Hr />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
