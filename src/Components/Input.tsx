import React from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Text,
    Keyboard,
}from 'react-native';

interface InputProps{
    label?:string;
    value:string;
    onChangeText:(text:string)=>void;
    placeholder?:string;
    secureTextEntry?:boolean;
    keyboardType?:any;
    error?:string;
}

const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
    error,
}:InputProps) =>{
    return(
        <View>
            {label && <Text style ={styles.label}>{label}</Text>}
        <TextInput
        value={value}
        onChangeText={onChangeText}
        // placeholder="placeholder",
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style = {[
            styles.input,
            error && styles.errorInput,
        ]}
        />
        {error ? <Text style={styles.error}>{error}</Text>:null}
        </View>
    );
};
const styles = StyleSheet.create({
label: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#595959',
    textAlign: 'left',
    left: 15,
    marginTop: 20,
  },
  input: {
    borderColor: '#a2a1a1',
    fontWeight: 500,
    borderRadius: 6,
    height: 50,
    margin: 8,
    borderWidth: 1,
    padding: 12,
    color: '#000',
    marginTop: 3,
  },
  error:{
    marginTop:4,
    fontSize:11,
    color:'#dc143c',
    fontFamily:'Poppins-Regular',
  },
  errorInput:{
    borderColor:'#dc143c'
  }
});

export default Input;