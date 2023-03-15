import {Text, useAndroidRipple} from "../Themed";
import {ArticleProps} from "./logic";
import {Pressable, StyleSheet, View} from "react-native";
import {PropsWithChildren} from "react";
import {useNavigation} from "@react-navigation/native";
import BookmarkShare from "./BookmarkShare";
import useColorScheme from "../../hooks/useColorScheme";
import Colors from "../../constants/Colors";

export default function ArticleContainer({data, children}: PropsWithChildren<ArticleProps>) {
  const navigation = useNavigation();
  const colorScheme = Colors[useColorScheme()];

  return (
    <Pressable
      style={{ width: '100%', paddingHorizontal: 10, marginTop: 10 }}
      android_ripple={useAndroidRipple()}
      onPress={() => navigation.navigate("Article", {body: data})}
    >
      {children}
      <View style={styles.footer}>
        <Text style={{flexGrow: 10, color: colorScheme.text}}>{toRelativeDate(data.date)}</Text>
        <BookmarkShare {...data} />
      </View>
    </Pressable>
  );
}

function toRelativeDate(date: Date | number | string): string {
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
    marginVertical: 5,
  }
});
