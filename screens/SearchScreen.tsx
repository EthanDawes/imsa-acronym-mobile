import {ScrollView} from 'react-native';
import {search} from "../constants/api";
import useAsync from "../hooks/useAsync";
import useAsyncIterator from "../hooks/useAsyncIterator";
import {RootStackScreenProps} from "../types";
import SmallArticle from "../components/Article/SmallArticle";
import {useEffect} from "react";

export default function SearchScreen({route}: RootStackScreenProps<"Search">) {
  const {query, domain} = route.params;
  const results = search(query, domain);
  const topics = useAsync(results.topics);
  const [pages, next] = useAsyncIterator(results.posts);
  console.log(pages.length);

  useEffect(() => {
    for (let i=0; i<10; i++) next();
  }, []);

  return (
    <ScrollView>
      {pages.map(page => (
        <SmallArticle data={page} key={page.id} />
      ))}
    </ScrollView>
  );
}
