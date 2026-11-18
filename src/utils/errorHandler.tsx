import SnackbarHandler from '../Components/Modals/FloatMessage';
import { setAuthExpire } from '../utils/authSlice';
import store from '../Store/store';


// Global flag to prevent multiple 401 handlers firing together
let isHandlingAuthError = false;

export function handleApiError(error: any) {
  let message = 'Something went wrong';
  // Logger.log('API response>>>>>>>>>>>>>', error, 'public');


  if (error.status === 'NETWORK_ERROR' || error.message === 'Network Error') {
    message = 'Please check your internet connection';
  } else if (error.statusCode === 401 || error.status === 401) {
    if (isHandlingAuthError) {
      // already handling, ignore duplicate 401s
      return;
    }
    if (error.message == 'Invalid Token') {
      isHandlingAuthError = true;
    }
    message = error.message;
    store.dispatch(setAuthExpire('expire'));
    setTimeout(() => {
      isHandlingAuthError = false;
    }, 3000);
  } else if (error.status >= 500 || error.statusCode >= 500) {
    message = '⚠️ Server is down, try again later';
  } else if (error.message) {
    message = error.message;
  }

  // Show snackbar
  setTimeout(() => {
    {
      message && SnackbarHandler.showMessage({
        message,
        type: error.status === 'NETWORK_ERROR' ? 'warning' : 'error',
      });
    }
  }, 300);
}
