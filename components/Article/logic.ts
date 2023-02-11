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
