import {RootStackScreenProps} from "../types";
import {Animated, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, View} from "react-native";
import useAsyncIterator from "../hooks/useAsyncIterator";
import wp, {ArticleFilter, getAllPosts} from "../constants/api";
import React, {useContext, useEffect, useState} from "react";
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
import IconButton from "../components/IconButton";
import {Subscription, useSubscriptions} from "../components/Article/logic";
import {SubscriptionsContext} from "../constants/context";

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
      headerTitle: () => <SearchDetailsHeader {...route.params} />,
      headerStyle: { backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card, height: 170 },
    } as NativeStackNavigationOptions,
  };
  const {
    onScrollWithListener /* Event handler creator */,
    containerPaddingTop /* number */,
    scrollIndicatorInsetTop /* number */,
  } = useCollapsibleHeader(options);

  // Native StackNavigator prevents header from collapsing
  const onScroll = onScrollWithListener(constructInfiniteScrollHandler(next));

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

function SearchDetailsHeader(props: Subscription) {
  const {img, domain, title, id} = props;
  const colorScheme = Colors[useColorScheme()];
  const [subscriptions, toggleSubscriptions] = useContext(SubscriptionsContext);

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
      <View style={{flexDirection: "row"}}>
        <IconButton icon={id in subscriptions ? "bell" : "bell-o"} action={toggleSubscriptions.bind(null, props)} />
        {/* for the text to be perfectly centered, padding should be 55, but I think this looks better*/}
        <Title style={{paddingRight: 45}}>{title}</Title>
      </View>
    </View>
  );
}
