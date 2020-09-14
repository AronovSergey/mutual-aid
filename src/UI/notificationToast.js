import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

export const showNotification = (message, notificationType) => {
    toast(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: notificationType,
    })
};