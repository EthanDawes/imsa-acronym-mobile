import React, {useEffect} from "react";
import useAsyncIterator from "../hooks/useAsyncIterator";
import {RefreshControl} from "react-native";
import constructInfiniteScrollHandler from "../components/constructInfiniteScrollHandler";

// This doesn't work because there is a circular dependency: needs to know containerPaddingTop from collapsableHeaderMixin,
// & collapsableHeaderMixin needs to know onScroll. TODO: would be ideal to separate
export default function useInfiniteScrollMixin<ItemT>(iterator: AsyncIterator<ItemT>, containerPaddingTop=0) {
  const [refreshing, setRefreshing] = React.useState(true);
  const [articles, next] = useAsyncIterator(iterator);
  let onScroll = constructInfiniteScrollHandler(next);

  // Load the first 10 articles b/c waiting for all images Promise.all is too long. Images get queued right away
  useEffect(() => {
    for (let i=0; i<10; i++) next().then(() => setRefreshing(false));
  }, []);

  return {
    onScroll,
    refreshControl:
      <RefreshControl refreshing={refreshing} enabled={false} progressViewOffset={containerPaddingTop} />,
    data: articles,
  }
}
