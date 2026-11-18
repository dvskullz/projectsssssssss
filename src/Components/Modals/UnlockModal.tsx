import React,{useState} from "react";
import {View,Text,Modal,StyleSheet,Image,TouchableOpacity} from 'react-native';
import Close from '../../assets/images/modalClose.svg';
import Unlock from '../../assets/images/unlock.svg'

const UnlockModal =({visible, onClose, modelName = 'Model'}:any)=>{
    
    // const [visible,setVisible] = useState(true);

    return(
        <Modal
        transparent={true}
        animationType="fade"
        visible={visible}
        >
            <View style={styles.overlay}> 
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeBtn}
                    >
                        <Close
                        width={20} 
                        />
                        </TouchableOpacity>

                        <View style={styles.iconContainer}>
                            <Unlock width={80}/>
                        </View>
                        <Text style={styles.title}>Unlock {modelName}'s Exclusive{'\n'}message for 199 </Text>
<TouchableOpacity style={styles.payBtn} >
    <Text style={styles.payText}>Pay Now</Text>
</TouchableOpacity>

                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#000000BF'
    },
    modalContainer:{
        width:'85%',
        backgroundColor:'#fff',
        borderRadius:16,
        padding:20,
        alignItems:'center',
        elevation:5
    },
    closeBtn:{
        position:'absolute',
        right:10,
        top:10,
        // backgroundColor:'#5f6f6f',
        width:20,
        height:20,
        borderRadius:6,
        justifyContent:'center',
        alignItems:'center'
    },
    iconContainer:{
        alignItems:'center',
        // marginBottom:5
    },
    title:{
        textAlign:'center',
        fontSize:16,
        marginTop:-5,
        marginVertical:10,
        fontFamily:'Poppins-SemiBold'
    },
    payBtn:{
        backgroundColor:'#dc143c',
        paddingVertical:12,
        paddingHorizontal:40,
        borderRadius:8,
        width:'80%'
    },
    payText:{
        color:'#fff',
        fontSize:16,
        fontFamily:'Poppins-SemiBold',
        textAlign:'center'
    }
})

export default UnlockModal;
