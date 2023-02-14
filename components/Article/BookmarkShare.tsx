import IconButton from "../IconButton";
import {Share} from "react-native";
import {FullArticle} from "./logic";
import {useContext} from "react";
import {BookmarkContext} from "../../constants/context";

export default function BookmarkShare(data: FullArticle) {
  const [bookmarks, toggleBookmark] = useContext(BookmarkContext);
  const isBookmarked = data.id in bookmarks;

  return (
    <>
      <IconButton icon={isBookmarked ? "star" : "bookmark"} action={toggleBookmark.bind(null, data)} />
      {/* TODO: I want to anchor to an element, but no types for that & I don't know the correct type
             https://reactnative.dev/docs/share*/}
      <IconButton icon={"share"} action={Share.share.bind(null, {message: data.url, url: data.url})} />
    </>
  );
}
