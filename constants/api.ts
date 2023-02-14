// Wordpress docs: https://developer.wordpress.org/rest-api/reference
// wp-api docs: http://wp-api.org/node-wpapi/api-reference/wpapi/1.1.2/index.html
// wp-types docs: https://www.npmjs.com/package/wp-types


import WPAPI, {WPRequest} from 'wpapi';
import * as WPTYPES from "wp-types";
import {decode} from 'html-entities';
import {FullArticle} from "../components/Article/logic";

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

const wp = new WPAPI({ endpoint: 'https://sites.imsa.edu/acronym/wp-json' });
export default wp;

export async function getAllCategories() {
  // Even though it looks like .get has typing, it is for error responses. Be warned!
  const categories = await wp.categories().get() as WPTYPES.WP_REST_API_Categories & WPResponse;
  const acc: Record<string, number> = {};
  for (const item of categories)
    acc[item.name] = item.id;
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
    nextPage = pageData._paging.next;
    yield* pageData.map<FullArticle>((i) => ({
      /// Try to avoid using this
      _raw: i,
      id: i.id,
      url: i.link,
      /// Title with all HTML characters decoded
      title: decode(i.title.rendered),
      // This is correct. "wp:featuredmedia" is typed as `unknown[]`, so I have no clue where it's getting {}
      imgUrl: i._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://sites.imsa.edu/acronym/files/2022/09/frontCover-copy-1-1-777x437.png",
      date: new Date(i.date),
      body: i.content?.rendered,
    }));
  }
}
