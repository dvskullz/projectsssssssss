import React,{useState} from "react";
import {Text,View,StyleSheet, TouchableOpacity,Alert, ActivityIndicator, Modal} from 'react-native';
import Switch from "../../Components/ToggleSwtitch";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationSettings = ()=>{
    const navigation = useNavigation<any>();
    const [general,setGeneral] = useState(true);
    const[notifSound, setNotifSound] = useState(false);
    const [payment, setPayment] = useState(false);
    const [loading,setLoading] = useState(false)
    const [showModal,setShowModal]= useState(false);


    const checkUpdates =()=>{
        setLoading(true);
        setTimeout(()=>{
            setLoading(false);
            setShowModal(true);
        },2000)
    }


    return(
        <View style={{flex:1, backgroundColor:'#fffd'}}>
            <View style={style.customHeader}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                <MaterialCommunityIcons
                    name="arrow-left"
                    size={25}
                    color={'#000'}
                />
                </TouchableOpacity>
                <Text style={style.headerTitle}>Notification Settings</Text>
                <View style={{width:4}}/>
            </View>
            <View style={style.headerSep}/>

            <View style={style.switchRow}>
                <Text style={style.Text}>General Notification</Text>
                <Switch
                value={general}
                onValueChange={setGeneral}
                />
            </View>
            <View style={style.switchRow}>    
                <Text style={style.Text}>Notification Sound</Text>
                <Switch
                value={notifSound}
                onValueChange={setNotifSound}
                />
                </View>
                
                <View style={style.switchRow}>
                <Text style={style.Text}>Payment Notification</Text>
                <Switch
                value={payment}
                onValueChange={setPayment}
                />
                </View>
                
                <TouchableOpacity style={style.switchRow} onPress={checkUpdates}>
                    <Text style={style.Text}>App Updates</Text>
                </TouchableOpacity>
                {loading && (
                    <View style={style.loader}>
                        <ActivityIndicator size={'large'} color={'#dc143c'}/>
                        </View>
                )}

                <Modal
                visible={showModal}
                transparent
                animationType="fade"
                >
                    <View style={style.modelOverlay}>
                        <View style={style.modalBox}>
                            <Text style={style.modalText}>No update found.</Text>
                            <TouchableOpacity onPress={()=>setShowModal(false)}>
                                <Text style={style.okButton}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
        </View>
    );

}

const style= StyleSheet.create({
    customHeader:{
        height:65,
    flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:15,
        backgroundColor:'#fff'
},
headerTitle:{
    fontSize:17,
    padding:18,
    textAlign:'center',
    fontFamily:'Poppins-Medium'
},
headerSep:{
    height:1,
    width:'100%',
    alignSelf:'center',
    backgroundColor:'#f1f1f150',
    marginTop:-5
},
switchRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:12,
    marginBottom:20,
    marginTop:25
},
Text:{
    fontFamily:'Poppins-Regular',
    fontSize:16
},
loader:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    justifyContent:'center',
    alignItems:'center',
    zIndex:10,
    backgroundColor:'rgba(0,0,0,0.2)'
},
modelOverlay:{
    flex:1,
    backgroundColor:'rgba(0,0,0,0.4)',
    justifyContent:'center',
    alignItems:'center'
},
modalBox:{
    width:'80%',
    backgroundColor:'#fff',
    borderRadius:12,
    padding:20,
    alignItems:'center'
},
modalText:{
    fontSize:16,
    fontFamily:'Poppins-Regular',
    color:'#333',
    marginBottom:15,
},
okButton:{
    color:'red',
    fontSize:16,
    alignItems:'flex-end',
    justifyContent:'flex-end'
}
});

export default NotificationSettings;
