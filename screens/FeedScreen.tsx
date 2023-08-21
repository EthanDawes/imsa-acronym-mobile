import {RootTabScreenProps} from '../types';
import React from "react";
import { View } from 'react-native'; 
import LargeArticle from "../components/Article/LargeArticle";
import wp, {getAllPosts} from "../constants/api";
import InfiniteScroll from "../components/InfiniteScroll";
import {Hr} from "../components/Themed";

export default function FeedScreen({ navigation }: RootTabScreenProps<'FeedTab'>) {
  const iterator = getAllPosts(wp.posts().perPage(50));
  return (
    <View style={{ flex: 1, padding: 5 }}>
      <InfiniteScroll
        collapsibleHeader={true}
        iterator={iterator}
        renderItem={({item}) => <LargeArticle data={item} />}
        keyExtractor={item => "" + item.id}
        ItemSeparatorComponent={() => <Hr style={{marginHorizontal: 10}} />}
      />
    </View>
  );
}
