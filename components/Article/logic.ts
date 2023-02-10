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

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useAsyncStorage<Record<number, boolean>>("bookmarks", {});

  function toggleBookmark(articleId: number) {
    setBookmarks((oldVal) => ({
      ...oldVal,
      [articleId]: !oldVal[articleId],
    }));
  }

  return [bookmarks, toggleBookmark] as const;
}

export function share() {

}
