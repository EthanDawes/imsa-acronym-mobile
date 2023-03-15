import {Text, Title} from "../components/Themed";
import {SectionList, View} from "react-native";
import React, {useContext} from "react";
import {RootStackScreenProps} from "../types";
import {SubscriptionsContext} from "../constants/context";
import IconButton from "../components/IconButton";
import {ArticleFilter} from "../constants/api";

export default function NotificationsScreen({route, navigation}: RootStackScreenProps<"Notifications">) {
  const [subscriptions, toggleSubscriptions] = useContext(SubscriptionsContext);
  const sections = (["Authors", "Tags", "Topics"] as ArticleFilter[]).map(articleFilter => ({
    title: articleFilter,
    data: Object.entries(subscriptions).filter(([id, sub]) => sub.domain === articleFilter),
  }));

  return (
    <SectionList
      sections={sections}
      keyExtractor={([id, _]) => id}
      renderItem={({item: [id, subscription]}) => (
        <View style={{flexDirection: "row", paddingVertical: 10}}>
          <Text style={{flexGrow: 100}}>{subscription.title}</Text>
          <IconButton icon={id in subscriptions ? "bell" : "bell-o"} action={() => toggleSubscriptions(subscription)} />
        </View>
      )}
      renderSectionHeader={({section: {title}}) => (
        // TODO: center the button with the text
        <Title style={{marginBottom: 5}}>{title}<IconButton icon="plus" action={() => navigation.navigate("Search", {domain: title, query: "", addNotifications: true})} /></Title>
      )}
      style={{paddingHorizontal: 10}}
    />
  )
}
