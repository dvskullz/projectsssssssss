import React, { useState,useContext } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
  UIManager,
} from 'react-native';
import { IMAGES } from '../../../Constants/images';
import Male from '../../assets/images/male.svg';
import Female from '../../assets/images/female.svg';
import { SnackbarContext } from '../../Components/Snackbar';
import { useDispatch } from 'react-redux';
import { setHasCompletedPreference, setLoggedIn } from '../../Store/authSlice';
import CheckBox from '@react-native-community/checkbox';
import CustomButton from '../../Components/Button'
import Adv from '../../assets/images/adventurous.svg';
import Ply from '../../assets/images/playful.svg';
import Roma from '../../assets/images/Romantic.svg';
// if(
//   Platform.OS === 'android' &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

type PreferenceItem = {
    id:string;
    label:string;
    icon:any;
};
const Preferences: PreferenceItem[]=[
 {id:'passionate', label:'Passionate', icon:Adv},
  {id:'flirty', label:'Flirty',icon:Roma},
  {id:'playful', label:'Playful',icon:Ply},
  {id:'casual ', label:'Casual',icon:Adv},
  {id:'adventurous', label:'Adventurous',icon:Roma},
  {id:'technical', label:'Technical',icon:Ply},
  {id:'educational', label:'Educational',icon:Adv},
  {id:'supportive', label:'Supportive',icon:Roma},
  {id:'fun', label:'Fun',icon:Ply},
  {id:'professional', label:'Professional',icon:Adv},
  {id:'caring', label:'Caring',icon:Ply},
  {id:'Romantic', label:'Romantic',icon:Roma},
  {id:'serious', label:'Serious',icon:Adv},
]

const Preference = ({navigation}:any) => {
  const [gender, setGender] = useState<'Male' | 'Female' | null>(null);
  const { showSuccess, showError } = useContext(SnackbarContext);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [select, setSelect] = useState(false);
  const dispatch = useDispatch();
  const[loading,setIsLoading] = useState(false);
  
  const togglePreference = (id:string)=>{
    setSelectedPrefs(prev =>
      prev.includes(id)
      ? prev.filter(item =>item !== id)
      : [...prev , id]
    );
  };


const handleSubmit = async()=>{
      if(!gender){
      showError('Please Select the gender');
      return;
    }
      if(selectedPrefs.length === 0 ){
        showError('Please select at least one preference');
        return;
      }
try{
  setIsLoading(true);
await new Promise<void>(resolve => setTimeout(resolve, 1000));
  dispatch(setLoggedIn());
  dispatch(setHasCompletedPreference(true));
  showSuccess(' Sign Up Successfully, Welcome!',)
  // setTimeout(() => {
  //   navigation.reset({
  //     index: 0,
  //     routes: [{ name: 'MainApp', params: { screen: 'Home' } }],
  //   });
  // }, 1200);

}catch(e){
  showError('Something went wrong');
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
  {loading  && (
  <View style={styles.loaderOverlay}>
  <View>
  <ActivityIndicator size={'large'} color={'#dc143c'} />
  </View>
  </View>
  )}
      <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom:240}}
      >
        <View style={styles.container}>
          
        <Text style={styles.text}>Select{'\n'}Your Preference</Text>
        <Text style={styles.desc}>
          Can you share a bit more about what{'\n'}you're looking for?
        </Text>
        <Text style={styles.label1}>Gender</Text>
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

        <Text style={styles.label}>Preference</Text>
        
        {Preferences.map(item=>{
         const isSelected = selectedPrefs.includes(item.id);
        return(
        <TouchableOpacity
        style={[
          styles.prefBox,
          isSelected && styles.genderBoxActive,
        ]}
        key={item.id}
        activeOpacity={0.3}
        onPress={()=>togglePreference(item.id)}
        >
        <View style = {styles.preLeft}>
        {/* <Image source={item.icon} style={styles.prefIcon}/> */}
        <item.icon width={28} heeight={28} />
        <Text style={styles.prefText}>{item.label}</Text>
        </View>
        {isSelected &&(
        <CheckBox
        value={true}
        disabled
        tintColors={{ true: '#DC143C', false: '#999' }}
        />
        )}
        </TouchableOpacity>
);
})};
          </View>
          </ScrollView>
        <View style={styles.submitWrapper}> 
       <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        >
        <Text style={styles.buttonText}>Submit</Text>
       </TouchableOpacity>
      </View>
          </ImageBackground>
      
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  submitWrapper:{
    position:'absolute',
    bottom:10,
    left:16,
    right:16,
    zIndex:10
      },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    textAlign: 'left',
    left: 10,
    marginTop: -2,
  },
   label1: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    textAlign: 'left',
    left: 10,
    marginTop: -8,
  },
  text: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    bottom: 12,
    left: 8,
  },
  genderIcon: {
    position: 'absolute',
    left: 14,
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginHorizontal: 1,
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
    borderColor: '#EDEDED',
    marginBottom:12
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
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 390,
    paddingHorizontal: 15,
    top: 170,
    bottom:120,
    // justifyContent:'center',
    // padding: 'auto',
  },
  desc: {
    fontSize: 14,
    marginBottom: 24,
    fontFamily: 'Poppins-Medium',
    color: '#838383',
    lineHeight: 22,
    left:10,
    top: -10,
  },
  prefBox:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    borderWidth:1,
    borderColor:'#EDEDED',
    borderRadius:8,
    paddingHorizontal:16,
    height:55,
    marginVertical:6,
    backgroundColor:'#fff'
  },
  prefBoxActive:{
    borderColor:'#DC143c'
  },
  loaderOverlay:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:-90,
    backgroundColor: '#00000059',
    alignItems:'center',
    justifyContent:'center',
    zIndex:999,
  },
  prefText:{
    fontSize:16,
    fontFamily:'Poppins-Medium',
    color:'#000',
    // letterSpacing:1,
  },
  preLeft:{
    flexDirection:'row',
    alignItems:'center',
    gap:12
  },
  prefIcon:{
  width:26,
  height:26,
  resizeMode:'contain'
  },
  button: {
    // marginTop: 20,
    backgroundColor: '#DC143C',
    paddingVertical: 12,
    borderRadius:6,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
    },
    buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default Preference;
