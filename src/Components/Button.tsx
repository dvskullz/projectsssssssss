import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ title, onPress, style }:any) => {
  return (
    
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 30,
    backgroundColor: '#DC143C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
    
  },
  buttonText: {
     color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default CustomButton;
