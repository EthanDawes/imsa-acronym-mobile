import {androidRipple, Text} from "../Themed";
import IconButton from "../IconButton";
import {ArticleProps, share} from "./logic";
import {Pressable, StyleSheet, View} from "react-native";
import {PropsWithChildren} from "react";

export default function ArticleContainer({data, useBookmarks, children}: PropsWithChildren<ArticleProps>) {
  const {id, date} = data;
  const [bookmarks, toggleBookmark] = useBookmarks;
  const isBookmarked = id in bookmarks;

  return (
    <Pressable style={{ width: '100%' }} android_ripple={androidRipple()}>
      {children}
      <View style={styles.footer}>
        <Text style={{flexGrow: 10}}>{toRelativeDate(date)}</Text>
        <IconButton icon={isBookmarked ? "star" : "bookmark"} action={toggleBookmark.bind(null, {...data, body: ""})} />
        <IconButton icon={"share"} action={share} />
      </View>
    </Pressable>
  );
}

function toRelativeDate(date: Date | number): string {
  date = new Date(date);
  const now = new Date();
  const hoursAgo = (now.getTime() - date.getTime()) / 3.6e+6;  // Convert from ms
  const yearsAgo = now.getFullYear() - date.getFullYear();
  const monthsAgo = now.getMonth() - date.getMonth() + yearsAgo * 12

  if (hoursAgo < 24)  // Within the past day
    return Math.floor(hoursAgo) + " hr ago";
  else if (hoursAgo < 24 * 31)  // Within the past month. This may not always be the last calendar month, but that's OK
    return Math.floor(hoursAgo / 24) + " days ago";
  else if (hoursAgo < 24 * 265)  // Within the past year
    return monthsAgo + " months ago";
  return yearsAgo + " years ago";
}

const styles = StyleSheet.create({
  footer: {
    //flex: 1, Oddly, adding this makes container not show (only android, web works fine). Flex-grow works w/o this
    flexDirection: "row",
  }
});
