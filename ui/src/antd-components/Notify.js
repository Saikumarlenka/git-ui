import { notification } from "antd"; // Import Ant Design notification

// Helper to show notifications
export const notify = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: "topRight",
    duration: 3, // Duration for the notification
  });
};
