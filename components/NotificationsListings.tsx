import {Hr, Text, Title} from "./Themed";
import {View} from "react-native";
import React, {PropsWithChildren, useContext} from "react";
import {SubscriptionsContext} from "../constants/context";
import IconButton from "../components/IconButton";
import {ArticleFilter, SearchDomain} from "../constants/api";
import {useNavigation} from "@react-navigation/native";

export default function NotificationsListings({children}: PropsWithChildren) {
  const navigation = useNavigation();
  const [subscriptions, toggleSubscriptions] = useContext(SubscriptionsContext);
  const sections = (["Authors", "Topics"] as ArticleFilter[]).map(articleFilter => ({
    title: articleFilter,
    data: Object.entries(subscriptions).filter(([id, sub]) => sub.domain === articleFilter),
  }));

  // This was implemented as a SectionList, until it wasn't b/c I couldn't add other things in line with it
  return (
    <>{
      sections.map(({title, data}) =>
        <>
          <Hr />
          <View style={{flexDirection: "row", alignItems: "center", marginBottom: 5}}>
            <Title>{title}</Title>
            <IconButton icon="plus" action={() => navigation.navigate("Search", {domain: title as SearchDomain, query: "", addNotifications: true})} />
          </View>
          {data.map(([id, subscription]) =>
            <View style={{flexDirection: "row", paddingVertical: 10}}>
              <Text style={{flexGrow: 100}}>{subscription.title}</Text>
              <IconButton icon={id in subscriptions ? "bell" : "bell-o"} action={() => toggleSubscriptions(subscription)} />
            </View>
          )}
        </>)
    }</>
  );
}
