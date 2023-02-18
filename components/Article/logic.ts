import useAsyncStorage from "../../hooks/useAsyncStorage";
import * as WPTYPES from "wp-types";

export interface FullArticle {
  _raw: WPTYPES.WP_REST_API_Post;
  id: number,
  url: string,
  date: Date;
  imgUrl: string;
  title: string;
  body: string,
  author: WPTYPES.WP_REST_API_User,
  categories: Record<string, number>,
  tags: Record<string, number>,
  // If needed, I was thinking of implementing non-immediate values like:
  // comments: Promise<WPTYPES.WP_REST_API_COMMENTS>
}

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
