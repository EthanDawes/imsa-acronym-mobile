import {ScrollView} from 'react-native';
import {Text} from "../components/Themed";
import {search} from "../constants/api";
import useAsync from "../hooks/useAsync";
import useAsyncIterator from "../hooks/useAsyncIterator";
import {RootStackScreenProps} from "../types";
import SmallArticle from "../components/Article/SmallArticle";
import {useEffect, useState} from "react";
import {FullArticle} from "../components/Article/logic";
import useDebounce from "../hooks/useDebounce";

export default function SearchScreen({route}: RootStackScreenProps<"Search">) {
  const {query, domain} = route.params;
  const [topics, setTopics] = useState({} as Record<string, number>);
  const [pages, setPages] = useState([] as (FullArticle)[]);
  const debouncedQuery = useDebounce<string>(query, 500);

  useEffect(() => {
    if (query.length === 0) return;
    console.log("Searching");
    const results = search(query, domain);

    results.topics.then(setTopics);

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
    <ScrollView>
      {Object.keys(topics).map(topic => (
        <Text key={topic}>{topic}</Text>
      ))}
      {pages.map(page => (
        <SmallArticle data={page} key={page.id} />
      ))}
    </ScrollView>
  );
}
