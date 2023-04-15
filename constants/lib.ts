import Constants from "expo-constants";

export function toRelativeDate(date: Date | number | string): string {
  date = new Date(date);
  const now = new Date();
  const hoursAgo = (now.getTime() - date.getTime()) / 3.6e+6;  // Convert from ms
  const yearsAgo = now.getFullYear() - date.getFullYear();
  const monthsAgo = now.getMonth() - date.getMonth() + yearsAgo * 12

  if (hoursAgo < 1)
    return Math.floor(hoursAgo * 60) + " minutes ago";
  else if (hoursAgo < 24)  // Within the past day
    return Math.floor(hoursAgo) + " hr ago";
  else if (hoursAgo < 24 * 31)  // Within the past month. This may not always be the last calendar month, but that's OK
    return Math.floor(hoursAgo / 24) + " days ago";
  else if (hoursAgo < 24 * 265)  // Within the past year
    return monthsAgo + " months ago";
  return yearsAgo + " years ago";
}

export async function* noopAsyncGenerator<ItemT=never>(): AsyncGenerator<ItemT, void, undefined> {}

// ngl the documentation is awful https://docs.expo.dev/versions/latest/sdk/constants/#manifest
// manifest is defined 1st run, but no profile info. manifest2 is defined after eas update & does contain profile info
// Actual solution: https://docs.expo.dev/build-reference/variables/#built-in-environment-variables (gets reset on eas update)
// Persist on eas update: https://docs.expo.dev/eas-update/environment-variables/#setting-and-getting-environment-variables-when-publishing-an-update
export const isProd = process.env.EAS_BUILD_PROFILE === "production";
