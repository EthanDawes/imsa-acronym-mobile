import React, {PropsWithChildren, useEffect} from "react";
import {FlatList, Animated, RefreshControl, FlatListProps} from "react-native";
import useAsyncIterator from "../hooks/useAsyncIterator";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useCollapsibleHeader} from "react-navigation-collapsible";
import constructInfiniteScrollHandler from "./constructInfiniteScrollHandler";
import LargeArticle from "./Article/LargeArticle";
import useColorScheme from "../hooks/useColorScheme";
import WithAnimatedValue = Animated.WithAnimatedValue;
import useCollapsibleHeaderMixin from "../mixins/useCollapsibleHeaderMixin";

// I'm using this instead of the mixin strategy because all CollapsableHeaderLists are also InfiniteScrollLists
// TODO: should I allow passing AnimatedProps<FlatListProps<ItemT>>
export default function InfiniteScroll<ItemT>(props: PropsWithChildren<{collapsibleHeader: true, iterator: AsyncIterator<ItemT>}> & Pick<FlatListProps<ItemT>, "keyExtractor" | "renderItem">) {
  const {collapsibleHeader, iterator, children, ...flatListProps} = props;
  const ListImplementation = collapsibleHeader ? Animated.FlatList : FlatList;
  const [refreshing, setRefreshing] = React.useState(true);

  const [articles, next] = useAsyncIterator(iterator);
  // Load the first 10 articles b/c waiting for all images Promise.all is too long. Images get queued right away
  useEffect(() => {
    for (let i=0; i<10; i++) next().then(() => setRefreshing(false));
  }, []);

  let onScroll = constructInfiniteScrollHandler(next);
  let usedCollapsibleHeaderMixin: {} | ReturnType<typeof useCollapsibleHeaderMixin> = {};
  let containerPaddingTop = 0;

  if (collapsibleHeader) {
    const mixin = useCollapsibleHeaderMixin(onScroll);
    usedCollapsibleHeaderMixin = mixin;  // Redundant for type checking
    containerPaddingTop = mixin.contentContainerStyle.paddingTop;
  }

  // TODO: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. {"contentLength": 11827.4287109375, "dt": 831, "prevDt": 807}
  return (
    <ListImplementation
      onScroll={onScroll}
      {...usedCollapsibleHeaderMixin}
      refreshControl={
        <RefreshControl refreshing={refreshing} enabled={false} progressViewOffset={containerPaddingTop} />
      }
      ListHeaderComponent={<>{children}</>}
      data={articles as WithAnimatedValue<ItemT>[] /* complains without the cast. I don't use any of these types, so it shouldn't matter*/}
      {...flatListProps}
    />
  );
}
