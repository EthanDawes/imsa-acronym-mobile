import {Text, useAndroidRipple} from "../Themed";
import {ArticleProps} from "./logic";
import {Pressable, StyleSheet, View} from "react-native";
import {PropsWithChildren} from "react";
import {useNavigation} from "@react-navigation/native";
import BookmarkShare from "./BookmarkShare";
import {toRelativeDate} from "../../constants/lib";

export default function ArticleContainer({data, children}: PropsWithChildren<ArticleProps>) {
  const navigation = useNavigation();

  return (
    <Pressable
      style={{ width: '100%', paddingHorizontal: 10, marginVertical: 10 }}
      android_ripple={useAndroidRipple()}
      onPress={() => navigation.navigate("Article", {body: data})}
    >
      {children}
      <View style={styles.footer}>
        <Text style={{flexGrow: 10}}>{toRelativeDate(data.date)}</Text>
        <BookmarkShare {...data} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  footer: {
    //flex: 1, Oddly, adding this makes container not show (only android, web works fine). Flex-grow works w/o this
    flexDirection: "row",
    alignItems: "center",
  }
});
