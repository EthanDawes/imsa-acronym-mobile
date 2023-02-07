import {StyleSheet, Image, View, Button} from 'react-native';

import {Text, Title} from '../Themed';
import ArticleFooter from "./ArticleFooter";
import {ArticleProps} from "./logic";


export default function SmallArticle({imgUrl, title, date}: ArticleProps) {
  return (
    <View style={styles.container}>
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
    </View>
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
