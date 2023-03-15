import {Text} from "../components/Themed";
import {FlatList, View} from "react-native";
import React, {useContext} from "react";
import {RootStackScreenProps} from "../types";
import {SubscriptionsContext} from "../constants/context";
import IconButton from "../components/IconButton";

export default function NotificationsScreen({route, navigation}: RootStackScreenProps<"Notifications">) {
  const {category} = route.params;
  // .slice removes the 's' to make more sense
  navigation.setOptions({ title: category.slice(0, -1) + ' notifications' });
  const [subscriptions, toggleSubscriptions] = useContext(SubscriptionsContext);
  return (
    <FlatList
      data={Object.entries(subscriptions).filter(([id, sub]) => sub.domain === category)}
      renderItem={({item}) => (
        <View style={{flexDirection: "row", paddingVertical: 10}}>
          <Text style={{flexGrow: 100}}>{item[1].title}</Text>
          <IconButton icon={item[0] in subscriptions ? "bell" : "bell-o"} action={() => toggleSubscriptions(item[1])} />
        </View>
      )}
    />
  )
}
