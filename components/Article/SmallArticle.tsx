import {StyleSheet, Image, View, Pressable} from 'react-native';

import {Text, Title} from '../Themed';
import ArticleContainer from "./ArticleContainer";
import {ArticleProps} from "./logic";


export default function SmallArticle(props: ArticleProps) {
  const {imgUrl, title} = props.data;
  return (
    <ArticleContainer {...props}>
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
    </ArticleContainer>
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
