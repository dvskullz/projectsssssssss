import {io} from 'socket.io-client';

const Socket_url = "https://api.luvoapp.com/chat";

let socket = null; 

export const connectSocket = (token)=>{
    if(!socket) {
        socket = io(Socket_url,{
            transports:["websocket"],
            autoConnect:false,
            reconnection:true,
            reconnectionAttempts:5,
            reconnectionDelay:1000,
            auth:{
                token:token
            },
        });
    } else {
        socket.auth = { token };
    }
    if( !socket.connected) {
        socket.connect();
    }
    return socket;
};
export const getSocket = () =>socket;
export const disconnectSocket = () => {
    if(socket){
        socket.disconnect();
        socket=null;
    }
};

// export default socket;


// const socket = io("https://api.luvoapp.com/chat");

// // Overwrite the onevent function to capture all incoming events
// const originalOnevent = socket.onevent;
// socket.onevent = function (packet) {
//     // packet.data[0] is the event name
//     // packet.data[1] is the event data
//     console.log("Captured Event Name:", packet.data[0]);
//     console.log("Event Data:", packet.data[1]);
    
//     // Call the original function to make sure handlers still work
//     originalOnevent.call(this, packet);
// };
