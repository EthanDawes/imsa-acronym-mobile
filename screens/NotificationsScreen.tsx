import {Text} from "../components/Themed";
import {ScrollView, Switch, View} from "react-native";
import {RootStackScreenProps} from "../types";
import NotificationsListings from "../components/NotificationsListings";
import useAsyncStorage from "../hooks/useAsyncStorage";

export default function NotificationsScreen({route, navigation}: RootStackScreenProps<"Notifications">) {
  const {item: allNotifs, setItem: setAllNotifs} = useAsyncStorage("allNotifs", false);
  const toggleAllNotifs = () => setAllNotifs(previousState => !previousState);

  return (
    <ScrollView style={{paddingHorizontal: 10}}>
      {/*TODO: delivered notifications would appear here*/}
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <Text style={{flexGrow: 100}}>All Notifications</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleAllNotifs}
          value={allNotifs}
        />
      </View>

      {!allNotifs &&
        <NotificationsListings />
      }
    </ScrollView>
  )
}
