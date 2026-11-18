import React, { useState, useContext, useEffect } from 'react';
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { IMAGES } from '../../../Constants/images';
import Button from '../../Components/Button';
import { OtpInput } from 'react-native-otp-entry';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SnackbarContext } from '../../Components/Snackbar';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { VerifyOtpThunk } from '../../Store/authSlice';
// import Pref from './Pref';
import Edit from '../src/assets/images/edit.svg';
import { Modal, TextInput } from 'react-native-paper';
// import Pref from './Pref';

const Verification = ({ navigation, route}: any) => {
  const { showSuccess, showError } = useContext(SnackbarContext);
  const dispatch = useDispatch<any>();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [loading,setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const { id,email } = route.params || {};
  const [showEditModal, setShowEditModal] = useState(false);
  const [newEmail,setNewEmail] = useState(email);

  const handleChangeEmail = () =>{
   email(setNewEmail);
   setShowEditModal(false);
  };

  const handleVerifyOtp = async () => {
    Keyboard.dismiss();
    if (!id) {
      showError('User id is missing. Please register again.');
      return;
    }
    if (!otp.trim()) {
      showError('OTP is required');
      return;
    }
    if (otp.length !== 4) {
      showError('OTP must be 4 digits');
      return;
    }
    try {
      setIsLoading(true);
      // console.log('Id', id);
      const result = await dispatch(VerifyOtpThunk({ 
        id,
        otp:otp, 
      })
    ).unwrap();
    
    if(result){
      setTimeout(()=>{
        showSuccess('OTP verified succesfully');
      },1100);
      }
        } catch (error: any) {
      showError(error?.message || 'Invalid OTP, please try again. ');
    }finally{
      setIsLoading(false);
    }
  };

  return (
      <ImageBackground
        source={IMAGES.Background}
        style={styles.background}
        resizeMode="cover"
        >
        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size={'large'} color={'#dc143c'} />
          </View>
        )}
        <SafeAreaView style={{ flex: 1 }}>
          {/* <Text style={styles.emailText}>
            {email}
          </Text>
        <TouchableOpacity style={styles.editButton}
            // onPress={()=>setShowEditModal(true)}
            >
              <Edit
              // name="pencil-outline"
              // size={15}
              // color="#232323"
      />
      </TouchableOpacity> */}
        <View style={styles.container}>
          <Text style={styles.text}>OTP{'\n'}Verification</Text>

          <Text style={styles.desc}>
            Enter the One-Time Password (OTP) sent to your{'\n'}registered email
            to verify your identity.
          </Text>
          <View style={styles.form}>
            <OtpInput
              numberOfDigits={4}
              onTextChange={setOtp}
              secureTextEntry
              // onFilled={text => console.log(`OTP is fully entered: ${text}`)}
              focusColor="#1ed5e1"
              theme={{
                pinCodeContainerStyle: styles.pinCodeContainer,
              }}
            />
          </View>

          <Text style={styles.desc1}>Resend OTP in </Text>
          <Button
            title="Submit"
            // onPress={() => navigation.navigate('ResetPassword')}
            onPress={handleVerifyOtp}
            style={styles.button}
          />
          <TouchableOpacity>
            <Text style={styles.register}> Resend OTP? </Text>
          </TouchableOpacity>
        </View>
        {/* <Modal
        // transparent
        // animationType='Fade'
        visible={showEditModal}
        >
          <View>
            <TouchableOpacity
            onPress={()=> setShowEditModal(false)}
            >
              <MaterialCommunityIcons
              name='close'
              size={14}
              color='#fff'
            />
            </TouchableOpacity>
              <Text>
                Change email address
              </Text>

<TextInput
value={newEmail}
onChangeText={setNewEmail}
// style={}
keyboardType='email-address'
/>
<TouchableOpacity
onPress={handleChangeEmail}
>
  <Text>Submit</Text>
</TouchableOpacity>
          </View>

        </Modal> */}
        </SafeAreaView>
      </ImageBackground>
   );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  button: {
    marginTop: 30,
    backgroundColor: 'rgb(220, 20, 60)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: 285,
    alignSelf: 'center',
  },
  emailText:{
    fontSize:12,
    fontFamily:'Poppins-Medium',
    color:'#000',
    top:340,
    // left:95,
position:'absolute',
alignSelf:'center'
  },
  text: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    bottom: 10,
    left: 12,
  },
  loaderOverlay:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    backgroundColor: '#00000059',
    alignItems:'center',
    justifyContent:'center',
    zIndex:999,
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
  desc1: {
    marginBottom: 35,
    fontSize: 14,
    top: 22,
    fontFamily: 'Poppins-Medium',
    color: '#838383',
    lineHeight: 22,
    left: 15,
  },
  form: {
    marginTop: 30,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 390,
    paddingHorizontal: 15,
    top: 8,
    justifyContent: 'center',
    padding: 'auto',
  },
  register: {
    color: '#DC143C',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    top: 25,
    textAlign: 'center',
    // letterSpacing: 1,
  },
  pinCodeContainer: {
    width: 50,
    height: 50,
    marginHorizontal: 15,
    borderWidth: 1,
    borderRadius: 8,
    bottom: 10,
    top: 5,
  },
 editButton: {
    position: 'absolute',
    top: 339,
    left: 220,
    zIndex: 10,
    // padding: 8,
    marginLeft:8,
  alignSelf:'center'
  },
});

export default Verification;
