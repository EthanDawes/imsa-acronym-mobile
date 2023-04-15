/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FullArticle, Subscription, UserComment} from "./components/Article/logic";
import {ArticleFilter, SearchDomain} from "./constants/api";
import Constants from "expo-constants";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
  // Tried but no luck https://stackoverflow.com/a/72080205
  type MaterialIconName = any;
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Settings: undefined;
  Notifications: undefined;
  Search: {
    // Defaults to ""
    query?: string,
    // Defaults to All
    domain?: SearchDomain,
    // Defaults to false. When enabled, clicking on a result will add it to your notifications (subscriptions) instead of opening the page
    addNotifications?: boolean,
  };
  SearchDetails: Subscription,
  Article: { body: FullArticle };
  Comments: {comments?: AsyncGenerator<UserComment, void, undefined>, articleId?: number};
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  FeedTab: undefined;
  SavedTab: undefined;
  // WARNING: different from root stack's search screen. Duplicated b/c I needed one for adding subscriptions, & another for searching
  SearchTab: RootStackParamList["Search"];
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

// Better typing for Constants.manifest2.metadata
export interface Metadata {
  updateGroup: string,  // As uuid
  branchName: "development" | "preview" | "production",
}
