import React, { useState} from 'react';
import { Text,Image,StyleSheet, View, TextInput,Pressable, TouchableOpacity,Dimensions} from 'react-native';
// import Button from '../../Components/Button';
import {IMAGES} from '../../../Constants/images';
import {Dropdown} from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import Eye from '../../assets/images/eye.svg';
import EyeOff from '../../assets/images/eye-off.svg';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const screenHeight = Dimensions.get('window').height;

const Password = () =>{

    const [oldPassword,setOldPassword] = useState('');
    const [newPassword,setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isOldPasswordSecure,setIsOldPasswordSecure] = useState(true);
    const [isNewPasswordSecure,setIsNewPasswordSecure] = useState(true);
    const [isConfirmPasswordSecure,setIsConfirmPasswordSecure] = useState(true);

    const toggleOldPasswordVisibility = () => {
    setIsOldPasswordSecure(!isOldPasswordSecure);
  };

    const toggleNewPasswordVisibility = () => {
    setIsNewPasswordSecure(!isNewPasswordSecure);
  };

    const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordSecure(!isConfirmPasswordSecure);
  };
  
  //   const DropdownComponent = () =>{
  //   const [value, setValue] = useState(null);
  // }


  // const data = [
  //   { label: 'Item 1 ', value:'1'},
  //   { label: 'Item 2 ', value:'2'},
  //   { label: 'Item 3 ', value:'3'},
  //   { label: 'Item 4 ', value:'4'},
  //   { label: 'Item 5 ', value:'5'},
  // ];


    return(
      <>
        <View style={styles.header}>
          <TouchableOpacity>
          <MaterialCommunityIcons
          name='arrow-left'
          size={24}
          color={'#000'}
          />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Password</Text>
<View style={{width:4}}/>
        </View>
        <Image
        source={IMAGES.topLogo}
        style={styles.logoCss}
        resizeMode="cover"
/>
     <SafeAreaView style={{ flex: 1, backgroundColor:'transparent' }}>
        <View style={styles.container}>
        <Text style={styles.text}>Change{'\n'}Your Password</Text>
        <Text style={styles.desc}>Enter your password to below to update it.</Text>
        
        <Text style = {styles.label}>Old Password</Text>
        <View style={styles.passwordWrapper}>
        <TextInput
                      value={oldPassword}
                      onChangeText={setOldPassword}
                      placeholderTextColor="#000000"
                      style={styles.input}
                      secureTextEntry={isOldPasswordSecure}
                      />
                       <Pressable
                onPress={toggleOldPasswordVisibility}
                style={styles.iconContainer}
                >
                {isOldPasswordSecure ? (
                  <Eye width={20} height={20} />
                ) : (
                  <EyeOff width={20} height={20} />
                )}
              </Pressable>
</View>
        <Text style = {styles.label}>New Password</Text>
       <View>
        <TextInput
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholderTextColor="#000000"
                      style={styles.input}
                    />
         <Pressable
                onPress={toggleNewPasswordVisibility}
                style={styles.iconContainer2}
              >
                {isOldPasswordSecure ? (
                  <Eye width={20} height={20} />
                ) : (
                  <EyeOff width={20} height={20} />
                )}
              </Pressable>
      <View style={styles.passwordWrapper}>

        <Text style = {styles.label}>Confirm New Password</Text>
         <TextInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholderTextColor="#000000"
                      style={styles.input}
                      />
          <Pressable
           onPress={toggleConfirmPasswordVisibility}
           style={styles.iconContainer3}
           >
                {isConfirmPasswordSecure ? (
                  <Eye width={20} height={20} />
                ) : (
                  <EyeOff width={20} height={20} />
                )}
              </Pressable>
              
                </View>
        {/* <Text>Select one </Text> */}
        {/* <TextInput>
          <Pressable>
            {/* <Dropdown
            
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            searchPlaceholder='Search...'
            value={value}
            onChange={item =>{
              setValue(item.value);
              }}
              >a
              
            </Dropdown> */}
          {/* </Pressable> */}
        {/* </TextInput>  */}
        </View>

</View>

</SafeAreaView>        
              </>
    )
};

const styles = StyleSheet.create({
    background:{
        flex:1,
    },
    text:{
          fontFamily: 'Poppins-Bold',
    fontSize: 32,
    bottom: 10,
    left: 12,
  },
  desc:{
 fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Poppins-Medium',
    color: '#838383',
    lineHeight: 22,
    left:16,
    top:-8
  },
  container:{
    flex:1,
    width: '100%',
    maxWidth: 390,
    paddingHorizontal: 15,
    // top: -55,
    marginTop:-120,
    justifyContent:'center',
    // padding: 'auto',
  },
    label: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#595959',
    textAlign: 'left',
    left: 15,
    marginTop: 3,
     },
     logoCss: {
    // top: -12,
    alignSelf: 'flex-end',
    width: screenHeight * 0.27,
    height: screenHeight * 0.27,
  },
input:{
    borderColor: '#EDEDED',
    fontWeight: 500,
    borderRadius: 6,
    height: 45,
    margin: 8,
    borderWidth: 1,
    padding: 12,
    // paddingLeft:12,
    color:'#000',
    // marginTop: 3,
},
 iconContainer: {
    position: 'absolute',
    right: 18,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    // top:16.5
  },
  iconContainer2:{
       position: 'absolute',
    right: 18,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    top:16.5
  },
  iconContainer3:{
         position: 'absolute',
    right: 18,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    // top:16.5
    top:14
  },
    passwordWrapper: {
    position: 'relative',
    justifyContent: 'center',
    // marginTop:5,
  },
  header:{
    height:65,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingHorizontal:15,
    backgroundColor:'#fc7b7212',
  },
  headerTitle:{
    fontSize:17,
    padding:18,
    textAlign:'center',
    fontFamily:'Poppins-Medium'
  }
    

})
export default Password;