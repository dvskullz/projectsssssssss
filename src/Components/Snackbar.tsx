import React,{Children, createContext, useState} from "react";
import { Dimensions, StyleSheet,Text, TouchableOpacity } from "react-native";
import { Snackbar } from "react-native-paper";

const {width} = Dimensions.get('window');
type SnackbarType = 'success' | 'error';

type SnackbarContextType= {
    showSuccess: (msg: string) =>void;
    showError: (msg: string) =>void;

};

export const SnackbarContext = createContext<SnackbarContextType>({
    showSuccess:() =>{},
    showError:()=>{},
});

export const SnackbarProvider = ({children}:any)=>{
    const [visible,setVisible]= useState(false);
    const [message,setMessage]= useState('');
    const [type,setType] = useState<SnackbarType>('success');

    const showSuccess = (msg:string)=>{
        setMessage(msg);
        setType('success');
        setVisible(true);
    };
    const showError = (msg:string)=>{
        setMessage(msg);
        setType('error');
        setVisible(true);
    };
const hide = () =>{
    setVisible(false);
};

return(
    <SnackbarContext.Provider value={{showSuccess, showError}}>
        {children}
        <Snackbar
        visible={visible}
        onDismiss={()=>setVisible(false)}
    // onDismiss={onDismissSnackBar}
        duration={1800}
        style={[ styles.container,
            type === "success" ? styles.successBg : styles.errorBg,
        ]}
        >
           <Text style={styles.text}>{(message)}</Text>
           <TouchableOpacity onPress={hide}>
            <Text style={styles.hide}>Hide</Text>
           </TouchableOpacity>
        </Snackbar>
    </SnackbarContext.Provider>
);
};

const styles = StyleSheet.create({
    
    hide:{
        fontFamily:'Poppins-Medium',
        fontSize:12,
        color:'#ffff',
        top:-26,
        left: 295,
        position:'absolute'
    },
    container:{
        position:'absolute',
        bottom:-22,
    width:width,
    // paddingVertical:16,
    // top:2,
    // paddingHorizontal:8,
    borderTopLeftRadius:25,
    borderTopRightRadius:25,
    borderTopStartRadius:25,
    borderTopEndRadius:25,
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',      
    alignSelf:'center'  
    },
    successBg:{
        backgroundColor:'#5eb949',
    },
    errorBg:{
        backgroundColor:'#c72626',

    },
    text:{
        top:-6,
           fontFamily:'Poppins-Medium',
        fontSize:12,
        color:'#ffff',
        // textAlign:'center'
    }
});
