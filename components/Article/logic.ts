import useAsyncStorage from "../../hooks/useAsyncStorage";
import * as WPTYPES from "wp-types";
import {ArticleFilter} from "../../constants/api";

export interface FullArticle {
  id: number,
  url: string,
  date: string,  // This should be string, not Date type b/c 1: it can't be serialized for bookmark storage 2: react navigation linking complains
  imgUrl: string,
  imgCaption: string,
  title: string,
  body: string,
  author: WPTYPES.WP_REST_API_User,
  categories: Record<string, number>,
  tags: Record<string, number>,
  excerpt: string,
  // If needed, I was thinking of implementing non-immediate values like:
  // comments: Promise<WPTYPES.WP_REST_API_COMMENTS>
}

export interface Subscription { id: number, title: string, img?: string, domain: ArticleFilter }

export interface ArticleProps {
  data: FullArticle,
}

export function useBookmarks() {
  const {item: bookmarks, setItem: setBookmark} = useAsyncStorage<Record<number, FullArticle>>("bookmarks", {});

  function toggleBookmark(articleInfo: FullArticle) {
    // `mergeBookmark` does not work b/c undefined keys are removed during JSONification
    // hopefully this doesn't cause race conditions
    setBookmark(oldVal => {
      if (articleInfo.id in oldVal) {
        const {[articleInfo.id]: _, ...newVal} = oldVal;
        return newVal;
      } else
        return {...oldVal, [articleInfo.id]: articleInfo};
    })
  }

  return [bookmarks, toggleBookmark] as const;
}

export function useSubscriptions() {
  const {item: subscriptions, setItem: setSubscriptions} = useAsyncStorage<Record<number, Subscription>>("subscriptions", {});

  function toggleSubscription(subscriptionInfo: Subscription) {
    setSubscriptions(oldVal => {
      if (subscriptionInfo.id in oldVal) {  // Remove
        const {[subscriptionInfo.id]: _, ...newVal} = oldVal;
        return newVal;
      } else  // Add
        return {...oldVal, [subscriptionInfo.id]: subscriptionInfo};
    })
  }

  return [subscriptions, toggleSubscription] as const;
}
