import React, { useState, useContext } from 'react';
import {
  Text,
  View,
  TextInput,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Keyboard,  TouchableWithoutFeedback
} from 'react-native';
import { IMAGES } from '../../../Constants/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../Components/Button';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import  Input from '../../Components/Input';
import { SnackbarContext } from '../../Components/Snackbar';


 
  const Forgot = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const {showSuccess, showError}= useContext(SnackbarContext);
 
  const isValidEmail = (email: string) =>{
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
  };
  
  
const validateEmail = (value: string) => {
  if (!value.trim()) {
    return 'Email is required';
  }
  if (!isValidEmail(value)) {
    return 'Please enter a valid email address';
  }
  return '';
};

const handleSend = async () => {
  const error = validateEmail(email);
  setEmailError(error);
  if (error) {
    return;
  }

  }
    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <ImageBackground
    source={IMAGES.Background}
    style={styles.background}
    resizeMode="cover"
  >
    <View style={styles.container}>
      <Text style={styles.text}>Forgot{'\n'}your Password</Text>
      <Text style={styles.desc}>
        Enter your registered email ID we'll send you{'\n'}one time password.
      </Text>
      <View style={styles.form}>
        <Text style={styles.label}>Enter Your Email
         <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          value={email}
          onChangeText={(text :string)=>{
          setEmail(text);
          setEmailError(validateEmail(text));
          }}
          keyboardType="email-address"
          style={[
            styles.input, emailError && styles.inputError,
          ]}
        />
        {emailError ? (
          <Text style={styles.errorText}>{emailError}</Text>
        ):null}
        <Button
          title="Send OTP"
          onPress={handleSend}
          style={{ backgroundColor: '#DC143C' }}
        />
    </View>
    </View>
    </ImageBackground>
    </TouchableWithoutFeedback>

  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  errorText:{
    color:'#dc143c',
    fontSize:12,
    fontFamily:'Poppins-Medium',
    marginLeft:15,
    marginTop:4,
    marginBottom:8,
  },
  text: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    bottom: 10,
    left: 12,
  },
  container: {
       flex: 1,
    width: '100%',
    maxWidth: 390,
    paddingHorizontal: 15,
    top: -10,
    justifyContent:'center',
    padding: 'auto',
  },
  inputError:{
    borderColor:'#dc143c'
  },
  desc: {
    fontSize: 12,
    marginBottom: 24,
    fontFamily: 'Poppins-Medium',
    color: '#555353',
    lineHeight: 22,
    left:14,
    top:-8 
  },
  label: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#595959',
    textAlign: 'left',
    left: 15,
  },
  form: {
    marginTop: 5,
  },
  input: {
    marginTop: 3,
    borderColor: '#8d8b8b',
    fontWeight: 500,
    borderRadius: 6,
    height: 45,
    margin: 8,
    borderWidth: 1,
    padding: 12,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  required:{
    color:'red'
  }
});

export default Forgot;
