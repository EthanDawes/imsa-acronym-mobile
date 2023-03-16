import {search, searchDomains} from "../constants/api";
import {RootStackScreenProps, RootTabScreenProps} from "../types";
import SmallArticle from "../components/Article/SmallArticle";
import React, {useEffect, useState} from "react";
import useDebounce from "../hooks/useDebounce";
import SearchItem from "../components/SearchItem";
import InfiniteScroll from "../components/InfiniteScroll";
import SegmentedSearch from "../components/SegmentedSearch";

export default function SearchScreen({route, navigation}: RootStackScreenProps<"Search"> | RootTabScreenProps<"SearchTab">) {
  const {query = "", domain = "All", addNotifications} = route.params ?? {};
  const debouncedQuery = useDebounce<string>(query, 500);
  const [results, setResults] = useState<AsyncIterator<JSX.Element>>(noop);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <SegmentedSearch dropdownItems={searchDomains} onInput={(query, domain) => navigation.setParams({query, domain})} initialDropdown={domain} />,
    })
  }, []);

  useEffect(() => {
    if (query.length === 0) return;
    console.log("Searching");
    const results = search(query, domain);

    setResults((async function*() {
      yield* Object.entries(await results.topics).map(([topic, id]) => (
        <SearchItem key={topic} title={topic} id={id} domain="Topics" addNotifications={addNotifications} />
      ));
      yield* Object.entries(await results.authors).map(([author, deets]) => (
        <SearchItem key={author} title={author} id={deets.id} img={deets.avatar_urls?.["96"]} domain="Authors" addNotifications={addNotifications} />
      ));
      yield* Object.entries(await results.tags).map(([tag, deets]) => (
        <SearchItem key={tag} title={tag} id={deets.id} domain="Tags" addNotifications={addNotifications} />
      ));
      for await (const page of results.posts)
        yield <SmallArticle data={page} key={page.id} />;
    })());
  }, [debouncedQuery, domain]);

  return (
    <InfiniteScroll
      iterator={results}
      renderItem={({item}) => item}
    />
  );
}

async function* noop() {
}
