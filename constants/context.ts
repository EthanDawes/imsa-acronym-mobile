import {createContext} from "react";
import {useBookmarks} from "../components/Article/logic";

export const BookmarkContext = createContext([{}, ()=>{}] as ReturnType<typeof useBookmarks>);
