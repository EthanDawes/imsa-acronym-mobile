import {RefreshControl, ScrollView} from 'react-native';
import {Text} from "../components/Themed";
import {getAllAuthors, getAllTags, search} from "../constants/api";
import useAsync from "../hooks/useAsync";
import useAsyncIterator from "../hooks/useAsyncIterator";
import {RootStackScreenProps} from "../types";
import SmallArticle from "../components/Article/SmallArticle";
import React, {useEffect, useState} from "react";
import {FullArticle} from "../components/Article/logic";
import useDebounce from "../hooks/useDebounce";
import SearchItem from "../components/SearchItem";

export default function SearchScreen({route}: RootStackScreenProps<"Search">) {
  const {query, domain} = route.params;
  const [topics, setTopics] = useState({} as Record<string, number>);
  const [authors, setAuthors] = useState({} as Awaited<ReturnType<typeof getAllAuthors>>);
  const [tags, setTags] = useState({} as Awaited<ReturnType<typeof getAllTags>>);
  const [pages, setPages] = useState([] as (FullArticle)[]);
  const [refreshing, setRefreshing] = useState(false);
  const debouncedQuery = useDebounce<string>(query, 500);

  useEffect(() => {
    if (query.length === 0) return;
    console.log("Searching");
    setRefreshing(true);
    const results = search(query, domain);

    results.topics.then(setTopics);
    results.authors.then(setAuthors);
    results.tags.then(setTags);
    Promise.all(Object.values(results)).then(() => setRefreshing(false));

    // I think it is safe to ignore promise rejection: next() is undefined
    const pages = (async () => {
      const pages: FullArticle[] = [];
      for await (const page of results.posts) {
        if (pages.length > 9) break;
        pages.push(page);
      }
      return pages;
    })();

    pages.then(setPages);
  }, [debouncedQuery, domain]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} enabled={false} />
      }
    >
      {Object.entries(topics).map(([topic, id]) => (
        <SearchItem key={topic} title={topic} id={id} domain="Topics" />
      ))}
      {Object.entries(authors).map(([author, deets]) => (
        <SearchItem key={author} title={author} id={deets.id} img={deets.avatar_urls?.["96"]} domain="Authors" />
      ))}
      {Object.entries(tags).map(([tag, deets]) => (
        <SearchItem key={tag} title={tag} id={deets.id} domain="Tags" />
      ))}
      {pages.map(page => (
        <SmallArticle data={page} key={page.id} />
      ))}
    </ScrollView>
  );
}
