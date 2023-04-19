# Contributing

## Setup
1. Install nodejs & packages (`cd <path/to/this/folder>` `npm i`)
2. Install expo cli (for building & distrubuting): `npm i -g eas-cli`
3. Install Expo Go on your phone
4. Run with `npm start`
   - You may need to make a ngrok account, otherwise remove the `--tunnel` flag
   - Scan the QR code with the Expo Go app
5. There are a ton of useful scripts in [package.json](package.json). Read them!

## File structure
```
Acronym/
├ .expo/  [Cached files]
├ .github/  [Automated workflows and promotional images]
├ assets/  [In-app images and fonts]
├ components/  [React files that aren't specific to any screen]
├ constants/  [Values that don't change]
│ └ api.ts  [functions to interact with Wordpress data]
├ hooks/  [functions that deal with state. Search online for more info]
├ mixins/  [pass these as spread props. You shouldn't have to worry about them probably]
├ navigation/
│ └ index.tsx  [Controls the different screens and tabs]
├ screens/  [Entry points to what you see for specific tasks]
└ package.json
```

## Distributing
Ask yourself, did you change something significant (Apple policy) or modify the `package.json` or `app.json` file?

**If yes**, build a new version:
1. `npm run build`
2. Publish to Android: download the `.aab` file from [Expo](https://expo.dev) and upload to [Google Play Console](https://play.google.com/console/u/0/developers)
   - Upload new build under the "Internal testing" tab
3. Publish to apple: `eas submit --platform ios`
   - See ["IMSA-specific" section](#imsa-specific) if you have issues

**If no**, publish an update:
1. `npm run update`. This will push an update over the air to all installed users without having to wait for Apple or Google's approval. In order for changes to be reflected, the app has to be opened, fully closed (swipe away), and opened again.

## IMSA-specific
- Ask the Acronym staff sponsor to add you as an "App Manager" to the Apple developer team and to the Google play console
- Ask the previous maintainer or staff sponsor to add you as a developer to the Expo account.
- EAS submit wants an App Store Connect API key. Here's how I solved this issue:
  1. `eas credentials -p ios`
  2. Select "production"
  3. yes, log in
  4. Select "App Store Connect: Manage your API Key"
  5. Select "Use an existing API Key for EAS Submit"
  6. There should be an option. If there isn't, you're on your own :/
