import {RefreshControl, Animated, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';

import { RootTabScreenProps } from '../types';
import React from "react";
import LargeArticle from "../components/Article/LargeArticle";
import wp, {getAllPosts} from "../constants/api";
import InfiniteScroll from "../components/InfinateScroll";

export default function FeedScreen({ navigation }: RootTabScreenProps<'FeedTab'>) {
  const iterator = getAllPosts(wp.posts().perPage(50));
  return (
    <InfiniteScroll
      collapsibleHeader={true}
      iterator={iterator}
      renderItem={({item}) => <LargeArticle data={item} />}
      keyExtractor={item => "" + item.id}
    />
  );
}
