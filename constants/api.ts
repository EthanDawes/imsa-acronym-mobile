// Wordpress docs: https://developer.wordpress.org/rest-api/reference
// wp-api docs: http://wp-api.org/node-wpapi/api-reference/wpapi/1.1.2/index.html
// wp-types docs: https://www.npmjs.com/package/wp-types


import WPAPI from 'wpapi';
import * as WPTYPES from "wp-types";
import {decode} from 'html-entities';
import {FullArticle, UserComment} from "../components/Article/logic";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Alert} from "react-native";

// TODO: if I was feeling nice, I would contribute this to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/wpapi/index.d.ts
// Documentation http://wp-api.org/node-wpapi/collection-pagination/
export interface WPResponse {
  _paging: {
    // The total number of records matching the provided query
    total: number;
    // The number of pages available (total / perPage)
    totalPages: number;
    // A WPRequest object pre-bound to the next page of results
    next?: WPAPI.WPRequest;
    // A WPRequest object pre-bound to the previous page of results
    prev?: WPAPI.WPRequest;
    // an object containing the parsed link HTTP header data (when present)
    links: unknown;  // TODO: I don't use this, so it's probably incorrect
  }
}

// Creds to https://stackoverflow.com/a/59239690
export type UnionType<T extends readonly any[]> = T[number];

export const searchDomains = [
  "All",
  "Topics",
  "Authors",
  "Posts",
] as const;

export type SearchDomain = UnionType<typeof searchDomains>;
export type ArticleFilter = Exclude<SearchDomain, "All" | "Posts"> | "Tags";

const wp = new WPAPI({ endpoint: 'https://sites.imsa.edu/acronym/wp-json' });
export default wp;

function sanitize(html: string) {
  return html.replace(/<\/?[^>]+(>|$)/g, "").trim();
}

/**
 * @return promise resolving to a mapping of category names to their ids
 */
export async function getAllCategories(request = wp.categories().perPage(100)) {
  // TODO: if there are more than 100 categories, they won't show up
  // Even though it looks like .get has typing, it is for error responses. Be warned!
  const categories = await request.get() as WPTYPES.WP_REST_API_Categories & WPResponse;
  const acc: Record<string, number> = {};
  for (const item of categories)
    acc[decode(item.name)] = item.id;
  return acc;
}

// TODO: this is pretty similar to getAllCategories & getAllTags, should they be combined?
export async function getAllAuthors(request = wp.users().perPage(100)) {
  const categories = await request.get() as WPTYPES.WP_REST_API_Users & WPResponse;
  const acc: Record<string, WPTYPES.WP_REST_API_User> = {};
  for (const item of categories)
    acc[decode(item.name)] = item;
  return acc;
}

export async function getAllTags(request = wp.tags().perPage(100)) {
  const categories = await request.get() as WPTYPES.WP_REST_API_Tags & WPResponse;
  const acc: Record<string, WPTYPES.WP_REST_API_Tag> = {};
  for (const item of categories)
    if (item.count > 0)
      acc[decode(item.name)] = item;
  return acc;
}

// Consider using Object.assign? https://stackoverflow.com/a/43626263
// Converts an array of identical objects to a single object where the keys are `key` and the value is the rest of the object or `val`
function arrayToObject<Array extends any[], Key extends keyof Array[number], Val extends keyof Array[number]>(array: Array, key: Key, val?: Val) {
  const acc: Record<string, Val extends undefined ? Array[number] : Array[number][Val]> = {};
  for (const item of array)
    // TODO: in a perfect world, I would ensure in signature that item[key] is a string, but that's too complicated
    acc[decode(item[key] as string)] = val ? item[val] : item;
  return acc;
}


/// Will get post info as prescribed by `request` parameter (100 items/page max, default 10). Assumes you want to get embedded data too
export async function* getAllPosts(request = wp.posts()) {
  let nextPage: WPAPI.WPRequest | undefined = request;
  while (nextPage) {
    // Using .embed is faster than subsequently getting the image. Tests using pagesize 50:
    // context=embed, _embed=false: 800ms initial, 5s 3rd, 40s 50th
    // context=embed, _embed=true: 1.5s all
    // context=view, _embed=true: 2.5s all
    const pageData = await nextPage.embed().get() as WPTYPES.WP_REST_API_Posts & WPResponse;
    // Unfortunately, .next.perPage here doesn't seem to do anything :/
    nextPage = pageData._paging?.next;
    yield* pageData.map<FullArticle>((i) => ({
      id: i.id,
      url: i.link,
      /// Title with all HTML characters decoded
      title: decode(i.title.rendered),
      // This is correct. "wp:featuredmedia" is typed as `unknown[]`, so I have no clue where it's getting {}
      imgUrl: (i._embedded?.["wp:featuredmedia"]?.[0] as WPTYPES.WP_REST_API_Attachment)?.source_url || "https://sites.imsa.edu/acronym/files/2022/09/frontCover-copy-1-1-777x437.png",
      imgCaption: sanitize((i._embedded?.["wp:featuredmedia"]?.[0] as WPTYPES.WP_REST_API_Attachment)?.caption?.rendered ?? ""),
      date: i.date,
      body: i.content?.rendered,
      author: (i._embedded?.author[0] as WPTYPES.WP_REST_API_User),
      categories: arrayToObject(i._embedded?.["wp:term"]?.[0] as WPTYPES.WP_REST_API_Categories, "name", "id"),
      tags: arrayToObject(i._embedded?.["wp:term"]?.[1] as WPTYPES.WP_REST_API_Tags, "name", "id"),
      // Regex can miss some cases, but I'm trusting WordPress to format HTML correctly, and worse case scenario, the user sees some wierd HTML tags. If insufficient, try `sanitize-html`
      excerpt: sanitize(decode(i.excerpt.rendered)),
    }));
  }
}

export async function* getPostComments(postId: number) {
  // https://sites.imsa.edu/acronym/wp-json/wp/v2/comments?post=30904
  let nextPage: WPAPI.WPRequest | undefined = wp.comments().perPage(100).param("post", postId);
  while (nextPage) {
    const commentData = await nextPage.get() as WPTYPES.WP_REST_API_Comments & WPResponse;
    nextPage = commentData._paging?.next;
    yield* commentData.map<UserComment>((i) => ({
      id: i.id,
      date: new Date(i.date),
      imgUrl: i.author_avatar_urls?.["24"] ?? "",
      body: sanitize(decode(i.content.rendered) ?? ""),
      authorName: i.author_name,
    }));
  }
}

/** Again, RN doesn't support URLSearchParams, so I'm polyfilling with https://stackoverflow.com/a/37562814 */
function constructSearchParams(details: Record<any, any>) {
  const formBody: string[] = [];
  for (const property in details) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  return formBody.join("&");
}

/**
 * @returns boolean indicating whether the post was successful (might fail if not authenticated)
 */
export async function submitComment(articleId: number, content: string, navigation: any) {
  const email = JSON.parse(await AsyncStorage.getItem("email") ?? "");
  const name = JSON.parse(await AsyncStorage.getItem("name") ?? "");
  if (!email || !name) {
    Alert.alert('Action failed', 'You need to be signed in to comment or like', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Sign in', onPress: () => navigation.navigate("Settings")},
    ]);
    return false;
  }
  await fetch('https://sites.imsa.edu/acronym/wp-comments-post.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: constructSearchParams({
      comment: content,
      author: name,
      email,
      comment_post_ID: articleId,
    })
  });
  /* Results in unauthenticated error :/
  // See https://www.tetchi.ca/how-to-post-comments-using-the-wordpress-rest-api
  await wp.comments().create({
    // No typescript, so reference https://developer.wordpress.org/rest-api/reference/comments/#arguments-2
    author_email: email,
    author_name: name,
    post: articleId,
    content: {
      // Which one?
      raw: content,
      rendered: content + "!",
    },
    author_user_agent: "app",
  });*/
  return true;
}

async function* noopAsyncGenerator() {}

export function search(query: string, domain: SearchDomain = "All") {
  const all = domain === "All";
  const results = {
    topics: Promise.resolve({} as Record<string, number>),
    authors: Promise.resolve({} as ReturnType<typeof getAllAuthors>),
    tags: Promise.resolve({} as ReturnType<typeof getAllTags>),
    // This should be a legal cast b/c no properties will be accessed
    posts: noopAsyncGenerator() as unknown as ReturnType<typeof getAllPosts>,
  };
  if (all || domain === "Topics") {
    results.topics = getAllCategories(wp.categories().perPage(all ? 2 : 100).search(query));
  }
  if (all || domain === "Posts") {
    results.posts = getAllPosts(wp.posts().perPage(11).embed().search(query).orderby("relevance"));
  }
  if (all || domain === "Authors") {
    results.authors = getAllAuthors(wp.users().perPage(all ? 2 : 100).search(query));
  }
  return results;
}
