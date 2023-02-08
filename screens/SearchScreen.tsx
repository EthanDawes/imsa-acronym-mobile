import {ScrollView, StyleSheet} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import SegmentedSearch from "../components/SegmentedSearch";
import Layout from "../constants/Layout";

export default function SavedScreen() {
  return (
    <View style={Layout.styles.scrollView}>
      <SegmentedSearch dropdownItems={["All", "Topics", "Authors"]} onInput={() => {}} placeholder={"Search everything"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink"
  },
});
