import {StyleSheet, Image, View, Pressable} from 'react-native';

import {useAndroidRipple, Text, Title} from './Themed';


export default function GameListing({imgUrl, href, title, description}: {imgUrl: string, href: string, title: string, description: string}) {
  return (
    <Pressable style={styles.container} android_ripple={useAndroidRipple()}>
      <View>
        <Image
          style={styles.smallImg}
          source={{
            uri: imgUrl,
          }}
        />
      </View>
      <View style={{flexShrink: 1}}>
        <Title>{title}</Title>
        <Text>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  smallImg: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginRight: 10,
  },
});
