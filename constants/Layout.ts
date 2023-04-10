import {Dimensions, StyleSheet} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  units: {
    REM: 16,
  },
  styles: StyleSheet.create({
    scrollView: {
      flex: 1,
      gap: 10,  // TODO: this is added in react-native 0.71. Wait for expo to be updated to v48
      padding: 10,
      paddingBottom: 0,
      //backgroundColor: 'pink',
    },
  }),
};
