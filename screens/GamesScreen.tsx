import {ScrollView, StyleSheet, View} from 'react-native';

import Layout from "../constants/Layout";
import GameListing from "../components/GameListing";

export default function GamesScreen() {
  return (
    <ScrollView>
      <View style={Layout.styles.scrollView}>
        <GameListing
          imgUrl={"https://reactnative.dev/img/tiny_logo.png"}
          href={"https://google.com"}
          title={"IMSA Wordle"}
          description={"Guess a new 5-letter, IMSA-themed word every day!"}
        />
        <GameListing
          imgUrl={"https://reactnative.dev/img/tiny_logo.png"}
          href={"https://google.com"}
          title={"Crossword"}
          description={"Classic Crossword using IMSA-themed words"}
        />
        <GameListing
          imgUrl={"https://reactnative.dev/img/tiny_logo.png"}
          href={"https://google.com"}
          title={"Pitch Perfect"}
          description={"Can you sing the correct pitches? Test your tonal accuracy and maybe even get better. Works with instruments too!"}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

});
