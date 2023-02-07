import {StyleSheet, Image, View, Pressable} from 'react-native';

import {androidRipple, Text, Title} from '../Themed';
import ArticleFooter from "./ArticleFooter";
import {ArticleProps} from "./logic";


export default function SmallArticle({imgUrl, title, date}: ArticleProps) {
  return (
    <Pressable style={styles.container} android_ripple={androidRipple()}>
      <View style={{flexDirection: "row"}}>
        <View style={{flexGrow: 100}}>
          <Text>Category</Text>
          <Title>{title}</Title>
        </View>
        <View>
          <Image
            style={styles.smallImg}
            source={{
              uri: imgUrl,
            }}
          />
        </View>
      </View>
      <ArticleFooter date={date} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  smallImg: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
});
