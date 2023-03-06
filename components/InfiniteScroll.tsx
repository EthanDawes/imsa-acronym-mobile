import React, {PropsWithChildren, useEffect, useState} from "react";
import {FlatList, Animated, RefreshControl, FlatListProps, Button} from "react-native";
import useAsyncIterator from "../hooks/useAsyncIterator";
import {UseCollapsibleOptions} from "react-navigation-collapsible";
import constructInfiniteScrollHandler from "./constructInfiniteScrollHandler";
import WithAnimatedValue = Animated.WithAnimatedValue;
import useCollapsibleHeaderMixin from "../mixins/useCollapsibleHeaderMixin";

// I'm using this instead of the mixin strategy because all CollapsableHeaderLists are also InfiniteScrollLists (for now)
// TODO: should I allow passing the full AnimatedProps<FlatListProps<ItemT>>?
export default function InfiniteScroll<ItemT>({collapsibleHeader=false, collapsibleOptions={}, iterator, children, ...flatListProps}:
                                              PropsWithChildren<{collapsibleHeader?: boolean, collapsibleOptions?: Partial<UseCollapsibleOptions>, iterator: AsyncIterator<ItemT>}> & Pick<FlatListProps<ItemT>, "keyExtractor" | "renderItem">) {
  const ListImplementation = collapsibleHeader ? Animated.FlatList : FlatList;
  const [refreshing, setRefreshing] = React.useState(true);

  const [articles, next] = useAsyncIterator(iterator);
  const [iterState, setIterState] = useState(iterator);
  if (iterState != iterator) {
    setIterState(iterator);
    setRefreshing(true);
  }
  // Load the first 10 articles b/c waiting for all images Promise.all is too long. Images get queued right away
  useEffect(() => {
    if (articles.length === 0) {
      console.log("I should fetch new stuff!");
      for (let i=0; i<9; i++) next();
      // don't hide loading until all are loaded (particularly an issue for SearchScreen, where category info appears before posts)
      next().then(() => setRefreshing(false));
      }
  }, [articles]);

  let onScroll = constructInfiniteScrollHandler(next);
  let usedCollapsibleHeaderMixin: {} | ReturnType<typeof useCollapsibleHeaderMixin> = {};
  let containerPaddingTop = 0;

  if (collapsibleHeader) {
    const mixin = useCollapsibleHeaderMixin(onScroll, collapsibleOptions);
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
