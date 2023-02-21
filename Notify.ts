import * as Notifications from "expo-notifications";
import {FullArticle} from "./components/Article/logic";

// This should be called at the top-level
export function initNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

// https://docs.expo.dev/versions/latest/sdk/notifications/#presentnotificationasynccontent-notificationcontentinput-identifier-string-promisestring
export function notify(articles: FullArticle[]) {
  Notifications.scheduleNotificationAsync({
    content: {
      title: 'New Acronym articles!',
      body: articles.length > 1 ?
        `Tap to see the ${articles.length} new articles:\n` + articles.map(a => a.title).join("\n")
        : `Tap to read ${articles[0].title}`,
    },
    trigger: null,
  });
}

export function notifyTest() {
  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Look at that notification',
      body: "I'm so proud of myself!",
    },
    trigger: null,
  });
}

// https://docs.expo.dev/versions/latest/sdk/notifications/#listen-to-notification-events
// TODO: react to press
