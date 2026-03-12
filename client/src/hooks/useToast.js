import { toast } from 'react-toastify';

const useToast = () => {
  const showSuccess = (message, options = {}) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "custom-toast-success",
      bodyClassName: "custom-toast-body",
      progressClassName: "custom-toast-progress-success",
      style: {
        backgroundColor: '#ffffff',
        color: '#065f46',
        border: '1px solid #10b981',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        padding: '16px',
        minHeight: '64px',
      },
      ...options,
    });
  };

  const showError = (message, options = {}) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "custom-toast-error",
      bodyClassName: "custom-toast-body",
      progressClassName: "custom-toast-progress-error",
      style: {
        backgroundColor: '#ffffff',
        color: '#991b1b',
        border: '1px solid #ef4444',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        padding: '16px',
        minHeight: '64px',
      },
      ...options,
    });
  };

  const showWarning = (message, options = {}) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "custom-toast-warning",
      bodyClassName: "custom-toast-body",
      progressClassName: "custom-toast-progress-warning",
      style: {
        backgroundColor: '#ffffff',
        color: '#92400e',
        border: '1px solid #f59e0b',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        padding: '16px',
        minHeight: '64px',
      },
      ...options,
    });
  };

  const showInfo = (message, options = {}) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "custom-toast-info",
      bodyClassName: "custom-toast-body",
      progressClassName: "custom-toast-progress-info",
      style: {
        backgroundColor: '#ffffff',
        color: '#1e40af',
        border: '1px solid #3b82f6',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        padding: '16px',
        minHeight: '64px',
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