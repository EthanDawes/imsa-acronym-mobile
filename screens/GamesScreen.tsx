import {ScrollView, StyleSheet, View} from 'react-native';

import Layout from "../constants/Layout";
import GameListing from "../components/GameListing";

export default function GamesScreen() {
  return (
    <ScrollView>
      <View style={Layout.styles.scrollView}>
        <GameListing
          imgUrl={"https://images.macrumors.com/t/zOCafmfJYd6tJf2Bju7xoICoVt8=/1200x1200/smart/article-new/2022/01/wordle.jpg"}
          href={"https://isma-wordle.glitch.me/"}
          title={"IMSA Wordle"}
          description={"Guess a new 5-letter, IMSA-themed word every day!"}
        />
        <GameListing
          imgUrl={"https://play-lh.googleusercontent.com/SEc2ZOUaIsyO6JkmaScxbn7GN59fS9WgtIHMLtw_Z9XG38JlsO6479V6TFwwkpnd2A"}
          href={"https://www.washingtonpost.com/crossword-puzzles/daily/"}
          title={"Crossword"}
          description={"Classic Crossword using IMSA-themed words"}
        />
        <GameListing
          imgUrl={"https://funblaster22.github.io/IMSAband/public/favicon.png"}
          href={"https://funblaster22.github.io/PitchRead/"}
          title={"Pitch Perfect"}
          description={"Can you sing the correct pitches? Test your tonal accuracy and maybe even get better. Works with instruments too!"}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

});
