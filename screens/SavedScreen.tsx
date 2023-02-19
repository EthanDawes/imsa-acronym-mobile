import {FlatList} from 'react-native';

import SmallArticle from "../components/Article/SmallArticle";
import React, {useContext} from "react";
import {BookmarkContext} from "../constants/context";

export default function SavedScreen() {
  const bookmarks = useContext(BookmarkContext)[0];

  return (
    <FlatList
      data={Object.values(bookmarks)}
      renderItem={({item}) => <SmallArticle data={item} />}
      keyExtractor={item => "" + item.id}
    />
  );
}
