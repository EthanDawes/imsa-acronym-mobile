import {StyleSheet, Image, View, Pressable} from 'react-native';

import {Text, Title} from '../Themed';
import ArticleContainer from "./ArticleContainer";
import {ArticleProps} from "./logic";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";
import {SharedElement} from "react-navigation-shared-element";


export default function SmallArticle(props: ArticleProps) {
  const {imgUrl, title, id} = props.data;
  const colorScheme = Colors[useColorScheme()];

  return (
    <ArticleContainer {...props}>
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <View style={{flexShrink: 1}}>
          <Text style={{color: colorScheme.text}}>Category</Text>
          <Title style={{flexShrink: 1}}>{title}</Title>
        </View>
        <SharedElement id={`article.${id}.photo`}>
          <Image
            style={styles.smallImg}
            source={{
              uri: imgUrl,
            }}
          />
        </SharedElement>
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
