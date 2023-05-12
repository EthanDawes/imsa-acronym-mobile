import {RootStackScreenProps} from "../types";
import wp, {ArticleFilter, getAllPosts} from "../constants/api";
import React, {useContext} from "react";
import SmallArticle from "../components/Article/SmallArticle";
import InfiniteScroll from "../components/InfiniteScroll";

export function SearchDetailsScreen({route}: RootStackScreenProps<"SearchDetails">) {
  const {domain, id} = route.params;
  const articles = getAllPosts(wp.posts().param({[getDomainSearchParam(domain)]: id}).perPage(50));

  return (
    <InfiniteScroll
      collapsibleHeader={true}
      iterator={articles}
      renderItem={({item}) => <SmallArticle data={item} />}
      keyExtractor={item => "" + item.id}
    />
  );
}

function getDomainSearchParam(domain: ArticleFilter) {
  switch (domain) {
    case "Authors":
      return "author";
    case "Tags":
      return "tags";
    case "Topics":
      return "categories";
  }
}
