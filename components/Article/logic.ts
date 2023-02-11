import useAsyncStorage from "../../hooks/useAsyncStorage";

export interface PreviewArticle {
  id: number,
  date: Date;
  imgUrl: string;
  title: string;
}

export interface FullArticle extends PreviewArticle {
  body: string,
}

export interface ArticleProps {
  useBookmarks: ReturnType<typeof useBookmarks>,
  data: PreviewArticle | FullArticle,
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

export function share() {

}
