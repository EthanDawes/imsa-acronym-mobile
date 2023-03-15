import {Image, StyleSheet, View} from 'react-native';

import {Text, Title} from '../Themed';
import ArticleContainer from "./ArticleContainer";
import {ArticleProps} from "./logic";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";


export default function SmallArticle(props: ArticleProps) {
  const {imgUrl, title} = props.data;
  const colorScheme = Colors[useColorScheme()];

  return (
    <ArticleContainer {...props}>
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <View style={{flexShrink: 1}}>
          <Text style={{color: colorScheme.text}}>Category</Text>
          <Title style={{flexShrink: 1}}>{title}</Title>
        </View>
        <Image
          style={styles.smallImg}
          source={{
            uri: imgUrl,
          }}
        />
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
