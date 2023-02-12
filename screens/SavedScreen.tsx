import {FlatList} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import {Hr, Text, View} from '../components/Themed';
import SmallArticle from "../components/Article/SmallArticle";
import React, {useContext} from "react";
import Layout from "../constants/Layout";
import {useBookmarks} from "../components/Article/logic";
import wp, {getAllPosts} from "../constants/api";
import useAsyncIterator from "../hooks/useAsyncIterator";
import {BookmarkContext} from "../constants/context";

export default function SavedScreen() {
  const [bookmarks, toggleBookmarks] = useContext(BookmarkContext);

  return (
    <FlatList
      data={Object.values(bookmarks)}
      renderItem={({item}) => <SmallArticle data={item} useBookmarks={[bookmarks, toggleBookmarks]} />}
      keyExtractor={item => "" + item.id}
    />
  );
}
