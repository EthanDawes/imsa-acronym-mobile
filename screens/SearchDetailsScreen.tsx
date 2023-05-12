import {RootStackScreenProps} from "../types";
import {Image, View} from "react-native";
import wp, {ArticleFilter, getAllPosts} from "../constants/api";
import React, {useContext} from "react";
import SmallArticle from "../components/Article/SmallArticle";
import {UseCollapsibleOptions} from "react-navigation-collapsible";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import {MaterialIcons} from "@expo/vector-icons";
import {getDomainIcon} from "../components/SearchItem";
import {Bold, Title} from "../components/Themed";
import {NativeStackNavigationOptions} from "@react-navigation/native-stack";
import IconButton from "../components/IconButton";
import {Subscription} from "../components/Article/logic";
import InfiniteScroll from "../components/InfiniteScroll";
import {SizeContext} from "../constants/context";
import Layout from "../constants/Layout";

export function SearchDetailsScreen({route}: RootStackScreenProps<"SearchDetails">) {
  const {domain, id} = route.params;
  const articles = getAllPosts(wp.posts().param({[getDomainSearchParam(domain)]: id}).perPage(50));

  const options: UseCollapsibleOptions = {
    navigationOptions: {
      headerTitle: () => <SearchDetailsHeader {...route.params} />,
      //headerStyle: { height: 180 },
    } as NativeStackNavigationOptions,
  };

  return (
    <InfiniteScroll
      collapsibleHeader={true}
      collapsibleOptions={options}
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

function SearchDetailsHeader(props: Subscription) {
  const { domain, title} = props;
  const colorScheme = Colors[useColorScheme()];
  const {item: size} = useContext(SizeContext);

  return(
    <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
      <MaterialIcons
        name={getDomainIcon(domain)}
        size={Layout.defaultTitleSize + size}
        color={colorScheme.text}
      />
      <Title>{title}</Title>
    </View>
  );
}
