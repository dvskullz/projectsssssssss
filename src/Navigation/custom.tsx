import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useDispatch, UseDispatch, useSelector } from 'react-redux';
import { RootState } from '../../src/Store/store';
import { logout } from '../../src/Store/authSlice';
import { IMAGES } from '../../Constants/images';
// import MyProfile from '../src/Screens/MyProfile';
// import MS from '../src/Screens/MS';
// import MyTransaction from '../src/Screens/MyTransaction';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SnackbarContext } from '../Components/Snackbar';
import Subs from '../../assets/images/subs.svg';
import Profile from '../../assets/images/profile.svg';
import Wallet from '../../assets/images/trans.svg';
import Refer from '../../assets/images/refer.svg';
import Lan from '../../assets/images/lan.svg';
import Notif from '../../assets/images/bell1.svg';
import Priv from '../../assets/images/priv.svg';
import Help from '../../assets/images/help.svg';
import Logout from '../../assets/images/logout.svg';
import Arrow from '../../assets/images/arrow-right.svg';
import Close from '../../assets/images/close.svg';

const BASE_URL = 'https://luvo.blr1.cdn.digitaloceanspaces.com/luvo/';

const Custom = (props: any) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch();
  const { showSuccess, showError } = useContext(SnackbarContext);
  const user = useSelector((state: RootState) => state.auth.user);
  // console.log('User', user);
  // console.log('Image:', user?.profileImage);

  const imageUri = user?.profileImage ? BASE_URL + user.profileImage : null;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, backgroundColor: '#fff1f4' }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={
              imageUri
                ? {
                    uri: imageUri,
                  }
                : IMAGES.Euser
            }
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.name}</Text>
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
            <Close style={styles.close} width={25} height={35} />
          </TouchableOpacity>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.logout}
            onPress={() => props.navigation.navigate('MyProfile')}
          >
            <Profile style={styles.icon} height={20} width={20} />
            <Text style={styles.itemText}> My Profile </Text>
            <Arrow style={styles.arrow} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logout}
          onPress={()=>props.navigation.navigate('MS')}>
            <Subs style={styles.icon1} height={25} width={25} />
            <Text style={styles.itemText}>Monetization & Subscriptions </Text>
            <Arrow style={styles.arrow} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logout}
            onPress={() => props.navigation.navigate('MyTransaction')}
          >
            <Wallet style={styles.icon} height={20} width={20} />
            <Text style={styles.itemText}>My Transaction</Text>
            <Arrow style={styles.arrow} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logout}
            onPress={() => props.navigation.navigate('Refer')}
          >
            <Refer style={styles.icon} height={20} width={20} />
            <Text style={styles.itemText}>Refer a friend</Text>
            <Arrow style={styles.arrow} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logout}
            onPress={() => props.navigation.navigate('Language')}
          >
            <Lan style={styles.icon} height={20} width={20} />
            <Text style={styles.itemText}>Language Settings</Text>
            <Arrow style={styles.arrow} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logout}
            onPress={() => props.navigation.navigate('NotificationSettings')}
          >
            <Notif width={20} height={20} style={styles.icon} />
            <Text style={styles.itemText}>Notification Settings</Text>
            <Arrow style={styles.arrow} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logout}
            onPress={() => props.navigation.navigate('Privacy')}
          >
            <Priv style={styles.icon} height={20} width={20} />
            <Text style={styles.itemText}>Privacy and Security </Text>
            <Arrow style={styles.arrow} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logout}>
            <Help style={styles.icon} height={20} width={20} />
            <Text style={styles.itemText}>Help Center </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logout}>
            <MaterialCommunityIcons
              name="delete"
              size={22}
              style={styles.deleteIcon}
              color={'#dc143c'}
            />
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logout}
            onPress={() => {
              dispatch(logout());
              showSuccess('Logged out successfully');
              props.navigation.closeDrawer();
            }}
          >
            <Logout style={styles.logoutIcon} width={20} height={20} />
            <Text style={styles.itemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerItem = ({ label }: { label: string }) => (
  <TouchableOpacity>
    <Text>{label}</Text>
  </TouchableOpacity>
);

export default Custom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    // backgroundColor:'#fff1f4'
  },
  header: {
    // marginBottom:10,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginBottom: 10,
    left: -20,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    top: -55,
    marginLeft: 40,
    // alignSelf:'center',
    // textAlign:'center'
  },
  menu: {
    top: -30,
    flex: 1,
    left: -35,
  },
  close: {
    position: 'absolute',
    left: 275,
    alignSelf: 'flex-end',
    top: -95,
  },
  arrow: {
    position: 'absolute',
    // alignSelf:'flex-end',
    left: 320,
  },
  item: {
    paddingVertical: 14,
  },
  icon1: {
    position: 'absolute',
    left: 10,
  },
  icon: {
    position: 'absolute',
    left: 14,
  },
  itemText: {
    fontSize: 16,
    left: 40,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  deleteIcon: {
    position: 'absolute',
    left: 11,
  },
  deleteText: {
    color: '#333',
    fontSize: 16,
    left: 39,
    fontFamily: 'Poppins-Medium',
  },
  logout: {
    marginTop: 20,
  },
  logoutIcon: {
    position: 'absolute',
    left: 10,
  },
});
