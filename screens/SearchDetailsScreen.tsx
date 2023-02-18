import {RootStackScreenProps} from "../types";
import {FlatList} from "react-native";
import useAsyncIterator from "../hooks/useAsyncIterator";
import wp, {getAllPosts} from "../constants/api";
import React, {useEffect} from "react";
import LargeArticle from "../components/Article/LargeArticle";
import SmallArticle from "../components/Article/SmallArticle";

export function SearchDetailsScreen({route}: RootStackScreenProps<"SearchDetails">) {
  const {domain} = route.params;
  const [articles, next] = useAsyncIterator(getAllPosts(wp.posts().perPage(50)));
  useEffect(() => {
    for (let i=0; i<10; i++) next();
  }, []);

  return (
    <FlatList
      data={articles}
      renderItem={({item}) => <SmallArticle data={item} />}
      keyExtractor={item => "" + item.id}
    />
  );
}
