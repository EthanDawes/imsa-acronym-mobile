import IconButton from "../IconButton";
import {Share, View} from "react-native";
import {FullArticle} from "./logic";
import {PropsWithChildren, useContext, useState} from "react";
import {BookmarkContext} from "../../constants/context";
import * as React from "react";
import {submitComment} from "../../constants/api";
import {useNavigation} from "@react-navigation/native";

const encouragements = [
  "Excellent reporting",
  "Fascinating!",
  "Thumbs up!",
  // Thank you, ChatGPT!
  "Great article! I found it to be informative and well-written.",
  "I really enjoyed reading this piece. It was engaging and provided valuable insights.",
  "Thank you for sharing your expertise on this topic. Your article was both educational and interesting.",
  "This is a wonderful article! I appreciate the time and effort you put into creating it.",
  "Your writing style is excellent, and I found your article to be both informative and entertaining.",
  "Fantastic job on this article! It was clear and concise, and the information was presented in a way that was easy to understand.",
  "I loved this article! It was well-researched and provided a unique perspective on the subject.",
  "Your article was inspiring and thought-provoking. I appreciate the fresh ideas and insights you brought to the table.",
  "This article was a joy to read. Your passion for the subject matter really shone through in your writing.",
  "Well done! Your article was insightful and engaging, and I look forward to reading more from you in the future.",
] as const;

export default function BookmarkShare(data: FullArticle & {enableHeart?: boolean}) {
  const {enableHeart, ...article} = data;
  const [bookmarks, toggleBookmark] = useContext(BookmarkContext);
  const [isLiked, setIsLiked] = useState(false);
  const isBookmarked = article.id in bookmarks;
  const navigation = useNavigation();

  function likePost() {
    if (!isLiked)
      submitComment(article.id, encouragements[Math.floor(Math.random() * encouragements.length)], navigation)
        .then(success => success && setIsLiked(true));
  }

  return (
    <View style={{flexDirection: "row", gap: 8}}>
      {enableHeart &&
        <IconButton icon={isLiked ? "thumbs-up" : "thumbs-o-up"} action={likePost} />
      }
      <IconButton icon={isBookmarked ? "bookmark" : "bookmark-o"} action={toggleBookmark.bind(null, article)} />
      {/* TODO: I want to anchor to an element, but no types for that & I don't know the correct type
             https://reactnative.dev/docs/share*/}
      <IconButton icon={"share"} action={Share.share.bind(null, {message: article.url, url: article.url})} />
    </View>
  );
}
