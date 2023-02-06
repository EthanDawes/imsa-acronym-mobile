import {StyleSheet, Image, View, Button} from 'react-native';

import {Text, Title} from '../Themed';
import IconButton from "../IconButton";

interface ArticleProps {
  imgUrl: string;
  title: string;
  date: Date;
}

export default function LargeArticle({imgUrl, title, date}: ArticleProps) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.bigImg}
        source={{
          uri: imgUrl,
        }}
      />
      <Title>{title}</Title>
      <View style={styles.footer}>
        <Text style={{flexGrow: 10}}>{date.toDateString()}</Text>
        <IconButton icon={"bookmark"} action={addBookmark} />
        <IconButton icon={"share"} action={share} />
      </View>
    </View>
  );
}

function addBookmark() {

}

function share() {

}

// TODO: more precise positioning besides "eyeballing it" (see tailwind?)
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  bigImg: {
    width: '100%',
    height: 200,
    borderRadius: 30,
  },
  footer: {
    //flex: 1, Oddly, adding this makes container not show (only android, web works fine). Flex-grow works w/o this
    flexDirection: "row",
  }
});
