import useAsyncStorage from "../../hooks/useAsyncStorage";

export interface ArticleFooterProps {
  id: number,
  date: Date;
  useBookmarks: ReturnType<typeof useBookmarks>,
}

export interface ArticleProps extends ArticleFooterProps {
  imgUrl: string;
  title: string;
}

export interface FullArticle extends ArticleProps {
  body: string,
}

export function useBookmarks() {
  const {item: bookmarks, mergeItem: mergeBookmark} = useAsyncStorage<Record<number, FullArticle | undefined>>("bookmarks", {});

  function toggleBookmark(articleInfo: FullArticle) {
    mergeBookmark({
      [articleInfo.id]: articleInfo.id in bookmarks ? undefined : articleInfo
    });
  }

  return [bookmarks, toggleBookmark] as const;
}

export function share() {

}
