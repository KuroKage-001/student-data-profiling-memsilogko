import { toast } from 'react-toastify';

const useToast = () => {
  const showSuccess = (message, options = {}) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "custom-toast-success",
      bodyClassName: "custom-toast-body",
      style: {
        backgroundColor: '#ffffff',
        color: '#1f2937',
        border: '2px solid #ea580c',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(234, 88, 12, 0.1), 0 8px 10px -6px rgba(234, 88, 12, 0.1)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '15px',
        fontWeight: '600',
        padding: '20px',
        minHeight: '72px',
      },
      ...options,
    });
  };

  const showError = (message, options = {}) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "custom-toast-error",
      bodyClassName: "custom-toast-body",
      style: {
        backgroundColor: '#ffffff',
        color: '#1f2937',
        border: '2px solid #c2410c',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(194, 65, 12, 0.1), 0 8px 10px -6px rgba(194, 65, 12, 0.1)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '15px',
        fontWeight: '600',
        padding: '20px',
        minHeight: '72px',
      },
      ...options,
    });
  };

  const showWarning = (message, options = {}) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "custom-toast-warning",
      bodyClassName: "custom-toast-body",
      style: {
        backgroundColor: '#ffffff',
        color: '#1f2937',
        border: '2px solid #fb923c',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(251, 146, 60, 0.1), 0 8px 10px -6px rgba(251, 146, 60, 0.1)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '15px',
        fontWeight: '600',
        padding: '20px',
        minHeight: '72px',
      },
      ...options,
    });
  };

  const showInfo = (message, options = {}) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "custom-toast-info",
      bodyClassName: "custom-toast-body",
      style: {
        backgroundColor: '#ffffff',
        color: '#1f2937',
        border: '2px solid #ea580c',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(234, 88, 12, 0.1), 0 8px 10px -6px rgba(234, 88, 12, 0.1)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '15px',
        fontWeight: '600',
        padding: '20px',
        minHeight: '72px',
      },
      ...options,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useToast;