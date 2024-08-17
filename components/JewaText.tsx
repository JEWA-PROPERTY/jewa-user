import React from 'react';
import { Text, StyleSheet } from 'react-native';

const JewaText = ({ style, ...props }: any) => {
  return <Text style={[styles.defaultStyle, style]} {...props} />;
};

const styles = StyleSheet.create({
  defaultStyle: {
    fontFamily: 'Nunito_400Regular',
  },
});

export default JewaText;