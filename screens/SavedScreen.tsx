import {FlatList} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import {Hr, Text, View} from '../components/Themed';
import SmallArticle from "../components/Article/SmallArticle";
import React from "react";
import Layout from "../constants/Layout";
import {useBookmarks} from "../components/Article/logic";
import wp, {getAllPosts} from "../constants/api";
import useAsyncIterator from "../hooks/useAsyncIterator";

export default function SavedScreen() {
  const [bookmarks, toggleBookmarks] = useBookmarks();

  return (
    <FlatList
      data={Object.values(bookmarks)}
      renderItem={({item}) => <SmallArticle data={{imgUrl: item.imgUrl, title: item.title, date: item.date, id: item.id}} useBookmarks={[bookmarks, toggleBookmarks]} />}
      keyExtractor={item => "" + item.id}
    />
  );
}
