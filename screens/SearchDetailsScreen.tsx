import {RootStackScreenProps} from "../types";
import {Animated, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, View} from "react-native";
import useAsyncIterator from "../hooks/useAsyncIterator";
import wp, {ArticleFilter, getAllPosts} from "../constants/api";
import React, {useEffect, useState} from "react";
import LargeArticle from "../components/Article/LargeArticle";
import SmallArticle from "../components/Article/SmallArticle";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import { useCollapsibleHeader, UseCollapsibleOptions} from "react-navigation-collapsible";
import constructInfiniteScrollHandler from "../components/constructInfiniteScrollHandler";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import {MaterialIcons} from "@expo/vector-icons";
import {getDomainIcon} from "../components/SearchItem";
import {Title} from "../components/Themed";
import {NativeStackNavigationOptions} from "@react-navigation/native-stack";

export function SearchDetailsScreen({route}: RootStackScreenProps<"SearchDetails">) {
  const {domain, id} = route.params;
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = useState(true);
  const [articles, next] = useAsyncIterator(getAllPosts(wp.posts().param({[getDomainSearchParam(domain)]: id}).perPage(50)));
  // TODO: consolidate duplicated code into InfinateScroll component
  useEffect(() => {
    for (let i=0; i<10; i++) next().then(() => setRefreshing(false));
  }, []);

  const options: UseCollapsibleOptions = {
    navigationOptions: {
      // headerTitle: () => <SearchDetailsHeader {...route.params} />,
      // title: "Thing",
      headerStyle: { backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card },
    } as NativeStackNavigationOptions,
    config: {
      // collapsedColor: colorScheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card,
      // disableOpacity: true,
    }
  };
  const {
    onScroll,
    onScrollWithListener /* Event handler creator */,
    containerPaddingTop /* number */,
    scrollIndicatorInsetTop /* number */,
  } = useCollapsibleHeader(options);

  const handler = ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollTop = nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height;
    const scrollHeight = nativeEvent.contentSize.height;
    const progress = scrollTop / scrollHeight * 100;
    // TODO: only load as many as user is going to see in the next second
    //const velocity = nativeEvent.velocity?.y;
    if (progress > 70) next();
  };

  //const onScroll = onScrollWithListener(handler);

  return (
    <Animated.FlatList
      onScroll={onScroll}
      contentContainerStyle={{ paddingTop: containerPaddingTop }}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
      data={articles}
      renderItem={({item}) => <SmallArticle data={item} />}
      keyExtractor={item => "" + item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} enabled={false} progressViewOffset={containerPaddingTop} />
      }
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

function SearchDetailsHeader({img, domain, title}: RootStackScreenProps<"SearchDetails">["route"]["params"]) {
  const colorScheme = Colors[useColorScheme()];

  return(
    <View style={{alignItems: "center"}}>
      <View style={{
        width: 96,
        height: 96,
        borderRadius: 1000,
        backgroundColor: colorScheme.tabIconDefault,
        alignItems: "center",
        justifyContent: "center"
      }}>
        {img &&
          <Image style={{borderRadius: 1000, width: 96, height: 96}} source={{uri: img}}/>
        }
        {!img &&
          <MaterialIcons
            name={getDomainIcon(domain)}
            size={80}
            color={colorScheme.text}
          />
        }
      </View>
      <Title>{title}</Title>
    </View>
  );
}
