import {Bold, Italics, Text, TextInput} from "../components/Themed";
import {RootStackScreenProps} from "../types";
import InfiniteScroll from "../components/InfiniteScroll";
import {Image, ListRenderItemInfo, View} from "react-native";
import {UserComment} from "../components/Article/logic";
import CommentForm from "../components/CommentForm";
import * as React from "react";
import {toRelativeDate} from "../constants/lib";

export default function CommentsScreen({route, navigation}: RootStackScreenProps<"Comments">) {
  const {comments, articleId} = route.params;

  return (
    <View style={{flex: 1}}>
      <InfiniteScroll
        iterator={comments}
        renderItem={Comment}
        style={{padding: 10}}
      />
      {articleId &&
        <CommentForm articleId={articleId} containerStyle={{margin: 10}} />
      }
    </View>
  );
}

function Comment({item: comment}: ListRenderItemInfo<UserComment>) {
  return (
    <View style={{flex: 1, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10}}>
      <Image style={{width: 35, height: 35, borderRadius: 1000}} source={{uri: comment.imgUrl}} />
      <View>
        <View style={{flexDirection: "row", gap: 8}}>
          <Bold>{comment.authorName}</Bold>
          <Italics>{toRelativeDate(comment.date)}</Italics>
        </View>
        <Text style={{flex: 1}}>{comment.body}</Text>
      </View>
    </View>
  )
}
