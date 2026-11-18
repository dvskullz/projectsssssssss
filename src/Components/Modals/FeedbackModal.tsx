import React,{useState} from "react";
import {View,Text,Modal,StyleSheet,Image,TouchableOpacity, TextInput} from 'react-native';
import Close from '../../assets/images/modalClose.svg';
import Rating from '../../assets/images/Rating.svg';

const FeedbackModal = ()=>{

    const [visible,setVisible] = useState(true);

    return(
        <Modal
        transparent={true}
        animationType="fade"
        visible={visible}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                    onPress={()=>setVisible(false)}
                    style={styles.closeBtn}
                    >
                        <Close
                        width={20}
                        />
                    </TouchableOpacity>
                    <View style={styles.iconContainer}>
                        <Rating width={80} />
                    </View>
                    <Text style={styles.title}>We appreciate your feedback could you please share the reason below for 3-star rating? </Text>
                    <TextInput
                    />
                    <TouchableOpacity style={styles.submitBtn}>
                        <Text>Submit</Text>
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
        backgroundColor:'#fffafb',
        borderRadius:16,
        padding:20,
        alignItems:'center',
        elevation:5
    },
    closeBtn:{
        position:'absolute',
        right:10,
        top:10,
        width:20,
        height:20,
        borderRadius:6,
        justifyContent:'center',
        alignItems:'center'
    },
    iconContainer:{
        alignItems:'center'
    }, title:{
        textAlign:'center',
        fontSize:16,
        marginTop:-5,
        marginVertical:10,
        fontFamily:'Poppins-SemiBold'
    },
    submitBtn:{
        backgroundColor:'#dc143c',
        paddingVertical:12,
        paddingHorizontal:40,
        borderRadius:8,
        width:'80%'
    },
    submitText:{
        color:'#fff',
        fontSize:16,
        fontFamily:'Poppins-SemiBold',
        textAlign:'center'
    }
})
export default FeedbackModal;