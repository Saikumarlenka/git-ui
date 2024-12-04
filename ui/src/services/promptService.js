import { notify } from "../antd-components/Notify";
import axiosInstance from "../axios/axiosInstance";


export const askLmApi = async (askData) => {
    try {
      const response = await axiosInstance.post("/ask-lm", askData); // Include request body
      const data = response.data;
  
      // Show success notification
      notify("success", "Success", "Request processed successfully!");
  
      return data;
    } catch (error) {
      console.error("Error in askLmApi:", error);
  
      // Show error notification
      notify(
        "error",
        "Failed to Process Request",
        error.response?.data?.message || "An unexpected error occurred."
      );
  
      
      throw error;
    }
  };