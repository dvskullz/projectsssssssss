import { duration } from "moment/moment";
import { Switch } from "react-native-gesture-handler";
import { Snackbar } from "react-native-snackbar";
const SnackbarHandler = {
    showMessage: ({message, type ='info', duration = Snackbar.LENGTH_SHORT}) =>{
        
        switch(type){
            case 'success':
                backgroundColor = '#4caf50';
                break;
            case 'error':
                backgroundColor ='#f44336';
                break;
            case 'warning':
                backgroundColor= '#ff9800';
                break;
            case 'info' :
                backgroundColor = '#2196f3';
                break;   
        }
        Snackbar.show({
            text:message,
            duration,
            backgroundColor,
            textColor:'#ffff',
            action:{text:'Hide', textColor:'#fff'},
        });
    },
};

export default SnackbarHandler;