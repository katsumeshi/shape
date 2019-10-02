import React from 'react';
import {
  Dimensions, PixelRatio, Text, TouchableOpacity, View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { withReducer } from 'recompose';
import { THEME_COLOR } from '../constants';


EStyleSheet.build();
const styles = EStyleSheet.create({
  $scale: PixelRatio.get() === 3 ? 1 : 1,
  title: {
    fontFamily: 'futura',
    fontWeight: 'bold',
    color: THEME_COLOR,
    fontSize: '3rem',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  button: {
    height: 44,
    borderRadius: 5,
    justifyContent: 'center',
    borderWidth: 1,
  },
  text: { textAlign: 'center', fontSize: '1rem' },
});

export const AppTitle = () => <Text style={styles.title}>Shape.</Text>;

export const Button = ({
  title, color = 'white', backgroundColor = THEME_COLOR, borderColor = 'transparent', style, onPress, iconComp,
}) => (
  <View style={[styles.buttonContainer, style]}>
    <TouchableOpacity style={{ ...styles.button, backgroundColor, borderColor }} onPress={onPress}>
      <View style={{ position: 'absolute', left: '16%' }}>{iconComp}</View>
      <Text style={{ ...styles.text, color }}>{title}</Text>
    </TouchableOpacity>
  </View>
);

const counterReducer = (count, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return count + 1;
    case 'DECREMENT':
      return count - 1;
    default:
      return count;
  }
};

export const test = withReducer('counter', 'dispatch', counterReducer, 0);
