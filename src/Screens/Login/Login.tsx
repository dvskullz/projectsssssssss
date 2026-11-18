import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  View,
  Pressable,
  TextInput,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { IMAGES } from '../../../Constants/images';
import Eye from '../../assets/images/eye.svg';
import EyeOff from '../../assets/images/eye-off.svg';
import CheckBox from '@react-native-community/checkbox';
import Button from '../../Components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi } from '../../API/auth';
import { SnackbarContext } from '../../Components/Snackbar';
import { useDispatch } from 'react-redux';
import { loginThunk } from '../../Store/authSlice';
import { AppDispatch } from '../../Store/store';
// import Input from '../Components/Input';

const Login = ({ navigation }: any) => {
  const { showSuccess, showError } = useContext(SnackbarContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(true);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const userCredentials = 'userCredentials';
  const [loading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  // const loading = useSelector((state: RootState)=> state.auth.loading);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 6;
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
  const validatePassword = (value: string) => {
    if (!value.trim()) {
      return 'Password is required';
    }
    if (!isValidPassword(value)) {
      return 'Password must include a minimum of 8 characters, at least one capital letter, one small letter, a number, and a special character.';
    }
    return '';
  };
  const togglePasswordVisibility = () => {
    setIsPasswordSecure(!isPasswordSecure);
  };
  const saveCredentials = async (email: string, password: string) => {
    try {
      // console.log('saving', email, password);
      const data = await AsyncStorage.setItem(
        userCredentials,
        JSON.stringify({
          email,
          password,
        }),
      );
    } catch (error) {
      // console.log('Error saving Credentials:', error);
    }
  };

  const handleLogin = async () => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setEmailError(emailErr);
    setPasswordError(passErr);
    if (emailErr || passErr) {
      return;
    }
    try {
      setError('');
      setIsLoading(true);
      const res = await loginApi(email, password);
      const accessToken = res.data.tokens.access.token;
      const refreshToken = res.data.tokens.refresh.token;
      const id = res.data.user.id;

      await dispatch(loginThunk({ email, password }));
      // console.log('AccessTOken', accessToken);
      // await login(accessToken, refreshToken);
      // console.log(id);
      // dispatch(setUserData(id))
      if (!accessToken && refreshToken) {
        showError('Invalid Email Id or Password');
      }
      showSuccess('Login Successful');
      if (remember) {
        await saveCredentials(email, password);
      } else {
        await AsyncStorage.removeItem('userCredentials');
      }
    } catch (error) {
      console.log(error)
      showError('Server Error');
    } finally {
      setIsLoading(false);
    }
  };
  const getCredentials = async () => {
    try {
      const data = await AsyncStorage.getItem('userCredentials');
      if (data) {
        const creds = JSON.parse(data);
        setEmail(creds.email);
        setPassword(creds.password);
        setRemember(true);
      }
    } catch (error) {
      showError('Something went wrong');
      // console.log('error retrieving', error);
    }
  };
  useEffect(() => {
    getCredentials();
  }, []);

  return (
    <ImageBackground
      source={IMAGES.Background}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    
          <View style={styles.container}>
            {loading && (
              <View style={styles.loaderOverlay}>
                <View>
                  <ActivityIndicator size={'large'} color={'#dc143c'} />
                </View>
              </View>
            )}
            <Text style={styles.text}>Hello!{'\n'}Welcome Back</Text>
            <Text style={styles.desc}>
              Enter your email ID and password to{'\n'}access your account.
            </Text>
            <View style={styles.form}>
              <Text style={styles.label}>
                Email
                <Text style={styles.required}>*</Text>
              </Text>
       <TextInput
       value={email}
       onChangeText={(text: string) => {
         setEmail(text);
         setEmailError(validateEmail(text));
        }}
       style={[
          styles.passwordInput,
          emailError && styles.inputError,
        ]}
       keyboardType="email-address"
      //  error={emailError}
      //  autoCapitalize="none"
       />
       {emailError ?(
        <Text style={styles.errorText}>{emailError}</Text>
       ):null}
       <Text style={[styles.label, { marginTop: 12 }]}>
            Password
         <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.passwordWrapper}>
       <TextInput
        value={password}
        onChangeText={(text: string) => {
          setPassword(text);
          setPasswordError(validatePassword(text));
        }}
        style={[
          styles.passwordInput,
          passwordError && styles.inputError,
        ]}
        secureTextEntry={isPasswordSecure}
       />
                <Pressable
                  onPress={togglePasswordVisibility}
                  style={styles.iconContainer}
                >
                  {isPasswordSecure ? (
                    <EyeOff width={22} height={22} />
                  ) : (
                    <Eye width={22} height={22} />
                  )}
                </Pressable>
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
              <View style={styles.rememberRow}>
                <View style={styles.rememberLeft}>
                  <CheckBox
                    value={remember}
                    onValueChange={setRemember}
                    tintColors={{ true: '#DC143C', false: '#999' }}
                  />
                  <Text style={styles.rememberText}>Remember Me</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
                  <Text style={styles.forgot}>Forgot Password ?</Text>
                </TouchableOpacity>
              </View>
              <Button
                title=" Login Now "
                onPress={handleLogin}
                style={{ backgroundColor: '#DC143C' }}
              />
              <Text style={styles.footer}>
                Don't have an account?
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={styles.register}> Register Now </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View> 
          {/* </View> */}
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  text: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    paddingLeft: 8,
    paddingRight: 10,
  },

  desc: {
    fontSize: 14,
    marginBottom: 34,
    fontFamily: 'Poppins-Medium',
    color: '#555353',
    lineHeight: 20,
    left: 11,
    marginTop: -6,
  },
  errorText:{
    color:'#dc143c',
    fontSize:12,
    fontFamily:'Poppins-Medium',
    marginLeft:15,
    marginTop:4,
    marginBottom:6,
  },
  inputError:{
    borderColor:'#dc143c'
  },
  label: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#595959',
    textAlign: 'left',
    left: 15,
    marginTop: 20,
  },
  form: {
    marginTop: -30,
  },

  passwordInput: {
    borderColor: '#8d8b8b',
    fontWeight: 500,
    height: 50,
    margin: 8,
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 56,
    marginTop: 3,
    borderRadius: 6,
    color: '#000',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 390,
    paddingHorizontal: 15,
    paddingTop: 145,
    justifyContent: 'center',
    // padding/: 'auto',
  },
  passwordIcon: {
    position: 'absolute',
    right: 16,
    top: -22,
    alignItems: 'center',
    gap: 6,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  rememberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 1,
    top: 2,
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  footer: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#838383',
    fontFamily: 'Poppins-Regular',
  },
  register: {
    color: '#DC143C',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    top: 10,
  },
  iconContainer: {
    position: 'absolute',
    right: 18,
    alignItems: 'center',
    justifyContent: 'center',
    top: 16.5,
  },
  forgot: {
    color: '#DC143C',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    left: -8,
    top: 2.5,
  },
  passwordWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  screen: {
    flex: 1,
    alignItems: 'center',
  },

  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -90,
    backgroundColor: '#00000059',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  required: {
    color: '#dc143c',
  },
  // loaderBox:{
  //   position:'absolute',
  //  paddingVertical:14,
  //  paddingHorizontal:10,
  //  borderRadius:12,

  //   // top:80,
  //   // // bottom:5,
  //   // left:0,
  //   // right:0,
  //   elevation:5,
  //   backgroundColor:'#dc143c',
  //   alignItems:'center',
  //   // justifyContent:'center'

  // }
});

export default Login;
