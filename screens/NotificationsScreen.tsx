import {View, Text} from "../components/Themed";
import Layout from "../constants/Layout";
import {ScrollView} from "react-native";
import React from "react";
import {RootStackScreenProps} from "../types";

export default function NotificationsScreen({route}: RootStackScreenProps<"Notifications">) {
  const {category} = route.params;
  return (
    <ScrollView>
      <View style={Layout.styles.scrollView}>
        <Text>{category}</Text>
      </View>
    </ScrollView>
  )
}
