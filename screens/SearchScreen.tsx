import {ScrollView, Text} from 'react-native';
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
  console.log(pages.length);

  useEffect(() => {
    console.log("Searching");
    const results = search(query, domain);

    results.topics.then(setTopics);

    const pages: Promise<FullArticle | void>[] = [];
    for (let i=0; i<10; i++) {
      pages.push(results.posts.next().then(post => post.value));
    }
    Promise.all(pages).then(pages => pages.filter((page): page is FullArticle => page != null)).then(setPages);
  }, [debouncedQuery, domain]);

  return (
    <ScrollView>
      {Object.keys(topics).map(topic => (
        <Text>{topic}</Text>
      ))}
      {pages.map(page => (
        <SmallArticle data={page} key={page.id} />
      ))}
    </ScrollView>
  );
}
