import wp, {getAllCategories, search, searchDomains} from "../constants/api";
import {RootStackScreenProps, RootTabScreenProps} from "../types";
import SmallArticle from "../components/Article/SmallArticle";
import React, {useContext, useEffect, useState} from "react";
import useDebounce from "../hooks/useDebounce";
import SearchItem from "../components/SearchItem";
import InfiniteScroll from "../components/InfiniteScroll";
import SegmentedSearch from "../components/SegmentedSearch";
import {Text, Title, useAndroidRipple} from "../components/Themed";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import useAsyncIterator from "../hooks/useAsyncIterator";
import useAsync from "../hooks/useAsync";
import {Dimensions, Pressable, View} from "react-native";
import Layout from "../constants/Layout";
import {useNavigation} from "@react-navigation/native";
import {TopicsContext} from "../constants/context";

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
    let domain = route.params?.domain ?? "All";
    if (query.length === 0 && (domain === "All" || domain === "Posts")) {
      setResults(noop())
      return;
    }
    console.log("Searching");
    const results = search(query, domain);

    setResults((async function*() {
      // I think ids can be shared across taxonomies, but URLs cannot+
      yield* Object.entries(await results.topics).map(([topic, id]) => (
        <SearchItem key={id} title={topic} id={id} domain="Topics" addNotifications={addNotifications} />
      ));
      yield* Object.entries(await results.authors).map(([author, deets]) => (
        <SearchItem key={deets.link} title={author} id={deets.id} img={deets.avatar_urls?.["96"]} domain="Authors" addNotifications={addNotifications} />
      ));
      yield* Object.entries(await results.tags).map(([tag, deets]) => (
        <SearchItem key={deets.link} title={tag} id={deets.id} domain="Tags" addNotifications={addNotifications} />
      ));
      for await (const page of results.posts)
        yield <SmallArticle data={page} key={page.id} />;
    })());
  }, [debouncedQuery, domain]);

  return (
    <InfiniteScroll
      iterator={results}
      renderItem={({item}) => item}
      // @ts-ignore expected Element, got Element[] (it still works)
      ListEmptyComponent={ListEmptyComponent.bind(null, route.params ?? {})}
    />
  );
}

function ListEmptyComponent(props: Parameters<typeof SearchScreen>[0]["route"]["params"] & {topics: ReturnType<typeof getAllCategories>}) {
  const {query = "", domain = "All"} = props;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const ripple = useAndroidRipple();
  const navigation = useNavigation();
  const topics = useAsync(useContext(TopicsContext), {});
  const padding = 30;

  if (query.length === 0 && domain === "All") {
    return <View style={{padding, alignItems: "center"}}>{
      Object.entries(topics).map(([topic, id], index, entries) => (
        <Pressable
          android_ripple={ripple}
          key={topic}
          style={{
            width: Math.min(360, Dimensions.get('window').width - padding),
            height: 100,
            borderRadius: 10,
            marginBottom: padding,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: `hsl(${index * 360 / entries.length}, 80%, ${colorScheme === "dark" ? 50 : 60}%)`,
          }}
          onPress={() => navigation.navigate("SearchDetails", {domain: "Topics", id, title: topic})}
        >
          <Title>{topic}</Title>
        </Pressable>
      ))
    }</View>
  } else {
    return <Text style={{color: colors.shadow, textAlign: "center", padding: 10}}>No results... yet!</Text>;
  }
}

async function* noop() {
}
