import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axiosInstance from '../Services/axiosInstance.tsx';
import SnackbarHandler from '../components/Modals/FloatMessage.js';

const QUEUE_KEY = 'offline_queue';

// Add request to queue
export async function enqueue(request) {
  const existing = JSON.parse(await AsyncStorage.getItem(QUEUE_KEY)) || [];
  existing.push(request);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(existing));

  SnackbarHandler.showMessage({
    message: 'Saved offline, will sync when online',
    type: 'warning',
  });
}

// Process queue when online
// async function processQueue() {
//   const queue = JSON.parse(await AsyncStorage.getItem(QUEUE_KEY)) || [];
//   if (!queue.length) return;

//   console.log('Processing queue:', queue);

//   const remaining = [];

//   for (let req of queue) {
//     try {
//       await axiosInstance({
//         method: req.method,
//         url: req.url,
//         data: req.data,
//         headers: req.headers,
//       });
//       console.log('Request synced:', req.url);
//     } catch (err) {
//       console.log('Request failed again, keeping in queue:', req.url);
//       remaining.push(req);

//       // SnackbarHandler.showMessage({
//       //   message: `Failed again: ${req.url}`,
//       //   type: 'error',
//       // });
//     }
//   }

//   await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
// }

// Setup listener for online/offline
export function setupQueueProcessor() {
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      console.log('Back online → retrying offline requests');
      // processQueue();
    }
  });
}
