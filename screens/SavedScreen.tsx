import {FlatList} from 'react-native';
import {Text} from "../components/Themed";

import SmallArticle from "../components/Article/SmallArticle";
import React, {useContext} from "react";
import {BookmarkContext} from "../constants/context";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";

export default function SavedScreen() {
  const bookmarks = useContext(BookmarkContext)[0];
  const colors = Colors[useColorScheme()];

  return (
    <FlatList
      data={Object.values(bookmarks)}
      renderItem={({item}) => <SmallArticle data={item} />}
      keyExtractor={item => "" + item.id}
      ListEmptyComponent={() => <Text style={{color: colors.shadow, textAlign: "center"}}>Bookmarked articles will appear here</Text>}
      style={{paddingHorizontal: 10}}
    />
  );
}
