import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateToast() {
    return (
        <ToastContainer />
    );   
}

export const notify = ({
    message = 'Something went wrong!',
    type = 'info',
    position = 'top-right',
    autoClose = 5000,
    hideProgressBar = true,
    closeOnClick = true,
}) => {
    if (toast[type]) {
        toast[type](message, {
            position,
            autoClose,
            hideProgressBar,
            closeOnClick,
        });
    } else {
        toast.info(message, {
            position,
            autoClose,
            hideProgressBar,
            closeOnClick,
        });
    }
};

export default CreateToast;
