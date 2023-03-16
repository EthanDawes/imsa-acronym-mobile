import IconButton from "../IconButton";
import {Share, View} from "react-native";
import {FullArticle} from "./logic";
import {PropsWithChildren, useContext} from "react";
import {BookmarkContext} from "../../constants/context";
import * as React from "react";

export default function BookmarkShare(data: FullArticle & {enableHeart?: boolean}) {
  const {enableHeart} = data;
  delete data.enableHeart;
  const [bookmarks, toggleBookmark] = useContext(BookmarkContext);
  const isBookmarked = data.id in bookmarks;

  return (
    <View style={{flexDirection: "row"}}>
      {enableHeart &&
        <IconButton icon={"thumbs-o-up"} action={() => {}} />
      }
      <IconButton icon={isBookmarked ? "bookmark" : "bookmark-o"} action={toggleBookmark.bind(null, data)} />
      {/* TODO: I want to anchor to an element, but no types for that & I don't know the correct type
             https://reactnative.dev/docs/share*/}
      <IconButton icon={"share"} action={Share.share.bind(null, {message: data.url, url: data.url})} />
    </View>
  );
}
