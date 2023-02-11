// Wordpress docs: https://developer.wordpress.org/rest-api/reference
// wp-api docs: http://wp-api.org/node-wpapi/api-reference/wpapi/1.1.2/index.html
// wp-types docs: https://www.npmjs.com/package/wp-types


import WPAPI from 'wpapi';
import * as WPTYPES from "wp-types";
import {decode} from 'html-entities';

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

/// Will get embed info for 50 posts at a time
export async function* getAllPosts(request = wp.posts()) {
  let nextPage: WPAPI.WPRequest | undefined = request;
  while (nextPage) {
    // 100 is the max items
    const pageData = await nextPage.get() as WPTYPES.WP_REST_API_Posts & WPResponse;
    // TODO: could I speed up page load by only loading 10 the first time? Takes only 700ms as opposed to 1000ms for 100
    // Unfortunately, .next.perPage here doesn't seem to do anything :/
    nextPage = pageData._paging.next;
    yield* pageData.map(async (i) => ({
      /// Try to avoid using this
      _raw: pageData,
      id: i.id,
      /// Title with all HTML characters decoded
      title: decode(i.title.rendered),
      img: i.featured_media ? (await wp.media().id(i.featured_media).get() as WPTYPES.WP_REST_API_Attachment).guid.rendered : "https://sites.imsa.edu/acronym/files/2022/09/frontCover-copy-1-1-777x437.png",
      date: new Date(i.date),
    }));
  }
}

export function getPosts(...ids: number[]) {
  return wp.posts().include(ids).get() as Promise<WPTYPES.WP_REST_API_Posts & WPResponse>;
}
