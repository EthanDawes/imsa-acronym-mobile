import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import wp, {getAllPosts} from "./constants/api";
import {notify} from "./Notify";
import {Subscription} from "./components/Article/logic";
import * as Notifications from "expo-notifications";
import {isProd} from "./constants/lib";

// Adapted from https://docs.expo.dev/versions/latest/sdk/background-fetch/#usage
const BACKGROUND_FETCH_TASK = 'background-fetch';

async function toArray<T>(asyncIterator: AsyncIterable<T>){
  const arr=[] as T[];
  for await(const i of asyncIterator) arr.push(i);
  return arr;
}

// Note: This needs to be called in the global scope (e.g outside of your React components)
export function initBackgroundSync() {
  // 1. Define the task by providing a name and the function that should be executed
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const nowISO = new Date().toISOString();
    const lastSyncDate = await AsyncStorage.getItem("lastSyncDate") ?? nowISO;
    const subscriptions = Object.values(JSON.parse(await AsyncStorage.getItem("subscriptions") ?? "{}") as Record<number, Subscription>);
    const allNotifs = JSON.parse(await AsyncStorage.getItem("allNotifs") ?? "false") as boolean;
    const newPosts = (await toArray(
      getAllPosts(wp.posts().embed().perPage(100).param("after", lastSyncDate))
    )).filter(post =>  // Only send notifs for subscribed posts
      // Equivalent to py any()
      subscriptions.some(subscription => (
        allNotifs
        || (subscription.domain === "Topics" && subscription.title in post.categories)
        || (subscription.domain === "Authors" && subscription.id === post.author.id)
      ))
    );
    AsyncStorage.setItem("lastSyncDate", nowISO);

    if (newPosts.length > 0) {
      notify(newPosts);
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else if (!isProd) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Nothing new',
          body: "Checked for new articles, but there were none",
        },
        trigger: null,
      });
    }
    return BackgroundFetch.BackgroundFetchResult.NoData;
  });

  registerBackgroundFetchAsync();
}

// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: __DEV__ ? 60 : 60 * 60 * 24, // 1 day
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}
