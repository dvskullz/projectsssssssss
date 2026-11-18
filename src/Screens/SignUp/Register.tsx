import React, { useState, useContext } from 'react';
import {
  Text,
  View,
  Pressable,
  TextInput,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { IMAGES } from '../../../Constants/images';
import Eye from '../../assets/images/eye.svg';
import EyeOff from '../../assets/images/eye-off.svg';
import Male from '../../assets/images/male.svg';
import Female from '../../assets/images/female.svg';
import Calendar from '../../assets/images/cal.svg';
import CheckBox from '@react-native-community/checkbox';
import Button from '../../Components/Button';
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal-v2';
import { SnackbarContext } from '../../Components/Snackbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Preference from '../Preference/Preference';
import { useDispatch } from 'react-redux';
import { registerThunk } from '../../Store/authSlice';
import { AppDispatch } from '../../Store/store';
import { registerApi } from '../../API/auth';

const Register = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [referral, setReferral] = useState('');
  const [phone, setphone] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [remember, setRemember] = useState(true);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isConfirmPasswordSecure, setIsConfirmPasswordSecure] = useState(true);
  const [countryCode, setCountryCode] = useState<CountryCode>('IN');
  const [callingCode, setCallingCode] = useState('91');
  const [gender, setGender] = useState<'Male' | 'Female' | null>(null);
  const [error, setError] = useState('');
  const [loading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useContext(SnackbarContext);
  const dispatch = useDispatch<any>();
  const [NameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passError, setPassError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const togglePasswordVisibility = () => {
    setIsPasswordSecure(!isPasswordSecure);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordSecure(!isConfirmPasswordSecure);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setDob(date);
    hideDatePicker();
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };
  const PhoneRegex = /^[6-9]\d{9}$/;

  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const ValidateName = (value: string) => {
    if (!trimmedName) {
      return 'Name is required';
    }
    if (trimmedName.length < 2) {
      return 'Name must be atleast 2 characters';
    }
    return '';
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

  const validateNumber = (value: string) => {
    if (!value.trim()) {
      return 'Phone numer is required';
    }
    if (countryCode === 'IN' && !PhoneRegex.test(value)) {
      return 'Please enter a valid phone number';
    }
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value.trim()) {
      return 'Password is required';
    }
    if (!isValidPassword(value)) {
      return 'Password must include a minimum 8 characters, at least one capital letter, one small letter, a number, and a special character';
    }
    return '';
  };

  const isValidConfirmPassword = (confirmPassword: string) => {
    return confirmPassword.length >= 6;
  };

  const validateConfirmPassword = (value: string) => {
    if (!value.trim()) {
      return 'Confirm Password is required';
    }
    if (!isValidConfirmPassword(value)) {
      return 'Passwords do not match';
    }
    return '';
  };

  const trimmedName = name.replace(/\s+/g, ' ').trim();

  const handleRegister = async () => {
    Keyboard.dismiss();

    if (!trimmedName) {
      showError('Name is required');
      return;
    }
    if (trimmedName.length < 2) {
      showError('Name must be atleast 2 characters');
      return;
    }
    if (!email.trim()) {
      showError('Email is required');
      return;
    }
    if (!isValidEmail(email)) {
      showError('Please enter a valid email address');
      return;
    }

    if (!phone.trim()) {
      showError('Phone numer is required');
      return;
    }
    if (countryCode === 'IN' && !PhoneRegex.test(phone)) {
      showError('Please enter a valid phone number');
      return;
    }
    if (!dob) {
      showError('Please select your date of birth');
      return;
    }
    if (!gender) {
      showError('Please select your gender');
      return;
    }
    if (!password.trim()) {
      showError('Password is required');
      return;
    }
    if (!isValidPassword(password)) {
      showError('Password must be at least 6 characters');
      return;
    }
    if (password != confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    if (!remember) {
      showError('Please accept the Terms & Conditions');
      return;
    }
    const formatDob = dob ? dob.toISOString().split('T')[0] : '';
    try {
      setIsLoading(true);
      const res = await dispatch(
        registerThunk({
          name,
          email,
          password,
          phone,
          confirmPassword,
          gender,
          dob: formatDob,
          fcmToken: 'fkdjkfdfdfjddf',
        }),
      ).unwrap();
      // console.log('Register Response:', res) 

      const id = res?.id ?? res?.data?.id;
      const statusCode = res?.statusCode ?? res?.data?.statusCode;
      const message = res?.message ?? res?.Message ?? res?.data?.message;
      if (statusCode === 200) {
        // console.log('id:', id);
        if (!id) {
          showError('Registration succeeded but user id was not returned');
          return;
        }
        showSuccess('OTP is sent on the email Id');
        navigation.replace('Verification', { email, id });
      }
      if (statusCode === 400 || /exist/i.test(message)) {
        showError('This email already exists. Please login instead.');
      }
    } catch (err: any) {
      showError('Registration Failed, Try Again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={IMAGES.Background}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={10}
          contentContainerStyle={{ paddingBottom: 35 }}
        >
          <View style={styles.container}>
            {loading && (
              <View style={styles.loaderOverlay}>
                <View>
                  <ActivityIndicator size={'large'} color={'#dc143c'} />
                </View>
              </View>
            )}
            <Text style={styles.text}>Register{'\n'}New Account</Text>
            <Text style={styles.desc}>
              Create a new account by entering your{'\n'}details below.
            </Text>
            <View>
              <Text style={styles.label}>
                Name
                <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={name}
                style={[styles.input, NameError && styles.inputError]}
                autoCapitalize="words"
                returnKeyType="next"
                onChangeText={(text: string) => {
                  setName(text);
                  setNameError(ValidateName(text));
                }}
              />
              {NameError ? (
                <Text style={styles.errorText}>{NameError}</Text>
              ) : null}
              <Text style={styles.label}>
                Email
                <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={email}
                placeholderTextColor="#000000"
                style={styles.input}
                onChangeText={(text: string) => {
                  setEmail(text);
                  setEmailError(validateEmail(text));
                }}
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
              <Text style={styles.label}>
                Phone Number
                <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.phoneRow}>
                <View style={styles.countryBox}>
                  <CountryPicker
                    countryCode={countryCode}
                    withCallingCode={true}
                    withCloseButton={true}
                    withAlphaFilter={true}
                    withEmoji={false}
                    withFilter={true}
                    withCallingCodeButton={false}
                    onSelect={(country: Country) => {
                      setCountryCode(country.cca2);
                      setCallingCode(country.callingCode[0]);
                    }}
                  />
                  <Text>+{callingCode}</Text>
                </View>
                <TextInput
                    value={phone}
                    style={styles.phoneInput}
                    keyboardType="number-pad"
                    maxLength={10}
                    onChangeText={setphone}
                  // {...phoneError ?(
                  //   <Text style={styles.errorText}>{phoneError}</Text>
                  // ):null}
                />
              </View>
              <Text style={styles.label}>
                DOB
                <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.dobWrapper}>
                <Pressable onPress={showDatePicker}>
                  <TextInput
                    style={styles.dobInput}
                    placeholder="Select Date of Birth"
                    editable={false}
                    value={
                      dob
                        ? dob.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })
                        : ''
                    }
                  />
                </Pressable>
                <Pressable
                  onPress={showDatePicker}
                  style={styles.dobContainer}
                >
                  <Calendar width={20} height={20} />
                </Pressable>
              </View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                maximumDate={new Date(2008,1,6)}
                // minimumDate={new Date(2008,1,6)}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              <Text style={styles.label}>
                Gender
                <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.genderRow}>
                <Pressable
                  style={[
                    styles.genderBox,
                    gender === 'Male' && styles.genderBoxActive,
                  ]}
                  onPress={() => setGender('Male')}
                >
                  <Male
                    style={styles.genderIcon}
                    height={20}
                    weight={20}
                    color={gender === 'Male' ? '#DC143C' : '#000'}
                  />
                  <Text
                    style={[
                      gender === 'Male' && styles.genderTextActive,
                      styles.genderText,
                    ]}
                  >
                    Male
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.genderBox,
                    gender === 'Female' && styles.genderBoxActive,
                  ]}
                  onPress={() => setGender('Female')}
                >
                  <Female
                    style={styles.genderIcon}
                    height={20}
                    weight={20}
                    color={gender === 'Female' ? '#DC143C' : '#000'}
                  />
                  <Text
                    style={[
                      styles.genderFemale,
                      gender === 'Female' && styles.genderTextActive,
                    ]}
                  >
                    Female
                  </Text>
                </Pressable>
              </View>
              <Text style={styles.label}>Referral Code</Text>
              <TextInput
                value={referral}
                placeholderTextColor="#000000"
                style={styles.input}
                onChangeText={text => setReferral(text)}
              />
              <Text style={styles.label}>
                Password
                <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  value={password}
                  // style={styles.input}
                  onChangeText={(text: string) => {
                    setPassword(text);
                    setPassError(validatePassword(text));
                  }}
                  style={[styles.passwordInput, passError && styles.inputError]}
                  secureTextEntry={isPasswordSecure}
                  // key={isPasswordSecure ? 'password-secure': 'password-visible'}
                />
                {passError ? (
                  <Text style={styles.errorText}>{passError}</Text>
                ) : null}

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
              <Text style={styles.label}>
                Confirm Password
                <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  value={confirmPassword}
                  placeholderTextColor="#000000"
                  // style={styles.input}
                  onChangeText={(text: string) => {
                    setConfirmPassword(text);
                    setConfirmPasswordError(validateConfirmPassword(text));
                  }}
                  secureTextEntry={isConfirmPasswordSecure}
                  style={[
                    styles.passwordInput,
                    confirmPasswordError && styles.inputError,
                  ]}
                />
                {confirmPasswordError ? (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ) : null}
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
              <View style={styles.rememberRow}>
                <View style={styles.rememberLeft}>
                  <CheckBox
                    value={remember}
                    onValueChange={setRemember}
                    tintColors={{ true: '#DC143C', false: '#999' }}
                  />
                  <Text style={styles.agree}>I agree to </Text>
                  <Text style={[styles.rememberText, { left: -5 }]}>
                    Terms and Conditions & Privacy Policy
                  </Text>
                </View>
              </View>
              <Button
                title="Register Now"
                onPress={handleRegister}
                style={{ backgroundColor: '#DC143C' }}
              />
              <Text style={styles.footer}>
                If you have an account?{''}
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.register}> Login Now </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
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
  text: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    bottom: -4,
    left: 8,
  },
  inputError: {
    borderColor: '#dc143c',
  },
  desc: {
    fontSize: 14,
    marginBottom: 18,
    fontFamily: 'Poppins-Medium',
    color: '#555353',
    lineHeight: 22,
    left: 10,
    top: -2,
  },
  agree: {
    fontFamily: 'Poppins-SemiBold',
    color: '#717171',
    fontSize: 11,
    top: 2,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#595959',
    textAlign: 'left',
    left: 12,
    marginTop: 8,
  },
  errorText: {
    color: '#dc143c',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginLeft: 15,
    marginTop: 4,
    marginBottom: 8,
  },
  input: {
    borderColor: '#a2a1a1',
    borderRadius: 6,
    height: 46,
    margin: 8,
    borderWidth: 1,
    marginTop: 3,
    color: '#000',
    padding: 12,
  },
  passwordInput: {
    borderColor: '#a2a1a1',
    fontWeight: 500,
    height: 50,
    margin: 8,
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 42,
    borderRadius: 6,
    marginTop: 3,
    color: '#000',
  },
  dobInput: {
    borderColor: '#a2a1a1',
    fontWeight: 500,
    height: 50,
    margin: 8,
    // marginTop:5,
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 42,
    borderRadius: 6,
  },
  genderIcon: {
    position: 'absolute',
    left: 14,
  },
  container: {
    flex: 1,
    // width: '100%',
    // maxWidth: 390,
    paddingHorizontal: 15,
    // top: 125,
    paddingTop: 125,
    // justifyContent:'center',
    // padding: 'auto',
  },
  loginbutton: {
    marginTop: 20,
    backgroundColor: '#DC143C',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  logintext: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  rememberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    left: 1,
  },
  rememberText: {
    marginLeft: 6,
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    top: 2,
  },
  footer: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
    color: '#838383',
    fontFamily: 'Poppins-Regular',
  },
  register: {
    color: '#DC143C',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    top: 10,
    // letterSpacing: 1,
  },
  iconContainer: {
    position: 'absolute',
    right: 18,
    justifyContent: 'center',
    top: 15,
  },
  dobContainer: {
    position: 'absolute',
    right: 18,
    justifyContent: 'center',
    // top: 15,
  },
  forgot: {
    color: '#DC143C',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    // fontWeight: '600',
    top: 3,
  },
  passwordWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  required: {
    color: '#DC143C',
  },
  dobWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    marginTop: 6,
    marginBottom: 8,
  },
  genderBox: {
    width: '48%',
    height: 45,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    position: 'relative',
    borderColor: '#e3e3e3',
  },
  genderBoxActive: {
    borderColor: '#DC143C',
  },
  genderText: {
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'Poppins-Medium',
    left: -20,
    margin: 10,
  },
  genderFemale: {
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'Poppins-Medium',
    left: -10,
    margin: 10,
  },
  genderTextActive: {
    color: '#DC143C',
    fontWeight: 600,
  },
  countryBox: {
    width: '30%',
    height: 44,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#a2a1a1',
  },
  phoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    marginTop: 6,
    marginBottom: 8,
  },
  phoneInput: {
    width: '68%',
    height: 44,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 12,
    borderColor: '#a2a1a1',
  },
});

export default Register;
