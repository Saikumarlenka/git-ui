import { notification } from "antd"; // Import Ant Design notification

// Helper to show notifications
export const notify = (type, message, description) => {
  if (['success', 'error', 'info', 'warning'].includes(type)) {
    notification[type]({
      message,
      description,
      placement: "bottomRight",
     duration: 3, 
    });
  
}}
