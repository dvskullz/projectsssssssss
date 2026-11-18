import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  ImageBackground,
  StyleSheet,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { IMAGES } from '../../../Constants/images';
import Eye from '../../assets/images/eye.svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EyeOff from '../../assets/images/eye-off.svg';
import Button from '../../Components/Button';

const ResetPassword = ({ navigation }: any) => {
 
  const [password, setPassword] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isConfirmPasswordSecure, setIsConfirmPasswordSecure] = useState(true);
  const [confirmpassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const isValidPassword = (password: string)=>{
    return password.length >=6;
  };
  
  const isValidConfirmPassword=(confirmpassword :string)=>{
    return confirmpassword.length >=6;
  };

  const validatePassword = (value:string)=>{
    if(!value.trim()){
      return 'Password is required';
    }
    if (!isValidPassword(value)){
      return 'Password must include a minimum of 8 characaters, at least one capital letter, one small letter, a number, and a special character. '
    }
    return '';
  }

  const validateConfirmPassword =(value:string)=>{
  if(!value.trim()){
    return 'Confirm Password is required';
  }
   if(!isValidConfirmPassword(value)){
       return 'Password and Confirm Password do not match';
    }
    return '';
  };

  const togglePasswordVisibility = () => {
    setIsPasswordSecure(!isPasswordSecure);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordSecure(!isConfirmPasswordSecure);
  };

  return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <ImageBackground
      source={IMAGES.Background}
      style={styles.background}
      resizeMode="cover" 
    >
       {/* <View style={styles.screen}> */}
        <View style={styles.container}>
          <Text style={styles.text}>Reset{'\n'}Your Password</Text>
          <Text style={styles.desc}>
            Create a new password for your account
          </Text>
          <View style={styles.form}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.passwordWrapper}>
            <TextInput
             value={password}
             // style={styles.passwordInput}
              onChangeText={(text: string) =>{
              setPassword(text)
              setPasswordError(validatePassword(text));
            } }
            style={[
              styles.passwordInput,
              passwordError && styles.inputError,
            ]}
             secureTextEntry={isPasswordSecure}
            /> 
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ):null} 
                <Pressable
                  onPress={togglePasswordVisibility}
                  style={styles.iconContainer}
                >
                  {isPasswordSecure ? (
                    <Eye width={22} height={22} />
                  ) : (
                    <EyeOff width={22} height={22} />
                  )}
                </Pressable>
            </View>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.passwordWrapper}>
                <TextInput
                  value={confirmpassword}
                  onChangeText={(text : string)=>{
                    setConfirmPassword(text)
                    setConfirmPasswordError(validateConfirmPassword(text));
                  }}
                  secureTextEntry={isConfirmPasswordSecure}
                  style={[
              styles.passwordInput,
              passwordError && styles.inputError,
            ]}
                />
                {confirmPasswordError ?(
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ):null}
              <Pressable
                onPress={toggleConfirmPasswordVisibility}
                style={styles.iconContainer}
              >
                {isConfirmPasswordSecure ? (
                  <Eye width={22} height={22} />
                ) : (
                  <EyeOff width={22} height={22} />
                )}
              </Pressable>
            </View>
            <Button
              title="Submit"
              // onPress={() => navigation.replace('')}
              style={{ backgroundColor: '#d63a3a' }}
            />
          </View>
        </View>
        {/* </View> */}   
    </ImageBackground>
    </TouchableWithoutFeedback >
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  text: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    bottom: 10,
    left: 12,
  },
   errorText:{
    color:'#dc143c',
    fontSize:12,
    fontFamily:'Poppins-Medium',
    marginLeft:15,
    marginTop:4,
    marginBottom:8,
  },
  desc: {
    fontSize: 12,
    marginBottom: 24,
    fontFamily: 'Poppins-Medium',
    color: '#838383',
    lineHeight: 22,
    left: 14,
    top: -8,
  },
  content: {
    flex: 1,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 390,
    paddingHorizontal: 15,
    // paddingTop: -70,
    top: 18,
    justifyContent: 'center',
    padding: 'auto',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#595959',
    textAlign: 'left',
    left: 15,
    marginTop: 8,
  },
  form: {
    // marginTop: 5,
  },
  input: {
    borderColor: '#dedddd',
    fontWeight: 500,
    borderRadius: 6,
    height: 45,
    margin: 8,
    marginTop: 3,
    paddingLeft: 12,
    paddingRight: 42,
    borderWidth: 1,
  },
  passwordInput: {
    borderColor: '#dedddd',
    height: 45,
    fontWeight: 500,
    margin: 8,
    borderWidth: 1,
    marginTop: 3,
    paddingLeft: 12,
    paddingRight: 42,
    borderRadius: 6,
  },
  passwordWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'absolute',
    right: 18,
    justifyContent: 'center',
    top: 15,
  },
   inputError:{
    borderColor:'#dc143c'
  },
});

export default ResetPassword;
