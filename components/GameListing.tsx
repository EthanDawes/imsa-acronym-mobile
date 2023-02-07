import {StyleSheet, Image, View, Pressable} from 'react-native';

import {androidRipple, Text, Title} from './Themed';


export default function GameListing({imgUrl, href, title, description}: {imgUrl: string, href: string, title: string, description: string}) {
  return (
    <Pressable style={styles.container} android_ripple={androidRipple()}>
      <View>
        <Image
          style={styles.smallImg}
          source={{
            uri: imgUrl,
          }}
        />
      </View>
      <View style={{flexGrow: 100}}>
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
  },
  smallImg: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
});
