/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import {LinkingOptions} from '@react-navigation/native';
import * as Linking from 'expo-linking';

import {RootStackParamList} from '../types';

// TODO: this doesn't seem to update any UI, figure out what it actually does
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Root: {
        screens: {
          FeedTab: {
            screens: {
              TabOneScreen: 'one',
            },
          },
          SavedTab: {
            screens: {
              TabTwoScreen: 'two',
            },
          },
          GamesTab: {
            screens: {
              TabThreeScreen: 'three',
            },
          },
        },
      },
      Settings: {
        screens: {
          SettingsScreen: 'settings',
        },
      },
      Notifications: {
        screens: {
          NotificationsScreen: 'notifications',
        },
      },
      Search: {
        screens: {
          SearchScreen: 'search',
        },
      },
      SearchDetails: {
        screens: {
          SearchDetailsScreen: 'searchDetails',
        },
      },
      Article: {
        screens: {
          ArticleScreen: 'article',
        },
      },
      Comments: {
        screens: {
          CommentsScreen: 'comments',
        },
      },
      NotFound: '*',
    },
  },
};

export default linking;
