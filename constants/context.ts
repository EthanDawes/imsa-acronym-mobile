import {createContext} from "react";
import {useBookmarks, useSubscriptions} from "../components/Article/logic";

export const BookmarkContext = createContext([{}, ()=>{}] as ReturnType<typeof useBookmarks>);
export const SubscriptionsContext = createContext([{}, ()=>{}] as ReturnType<typeof useSubscriptions>);
