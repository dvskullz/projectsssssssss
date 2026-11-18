// import React,{createContext, useState} from "react";
// import {StyleSheet, Text} from 'react-native';
// import { Snackbar } from "react-native-paper";
// import { create } from "react-test-renderer";

// type SnackBarType = 'success' | 'error';
// type SnackbarContextType = {
//     showSuccess: (msg: string)=> void;
//     showError:(msg:string)=> void;
// };

// export const SnackbarContextType = createContext<SnackbarContextType>({
//     showSuccess:() => {},
//     showError:()=>{},
// });

// export const SnackbarProvider = ({children}:any)=>{
//     const [visible,setvisible] = useState(false);
//     const [message,setMessage] = useState('');
//     const [type,setType]= useState<SnackBarType>('success');
//     const showSuccess = (msg:string) => {
//         setMessage(msg);
//         setType('success'),
//         setvisible(true);
//     };
//     const showError = (msg:string) =>{
//         setMessage(msg);
//         setType('error');
//         setvisible(true);
//     };
//     return(
//         <SnackbarContextType.Provider value ={{showSuccess, showError}} >
//             {children}
//         </SnackbarContextType.Provider>
//     )
// }
