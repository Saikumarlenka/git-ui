import { notify } from "../antd-components/Notify";
import axiosInstance from "../axios/axiosInstance";


export const askLmApi = async (askData) => {
    try {
      const response = await axiosInstance.post("/ask-lm", askData); 
      const data = response.data;
  
      // Show success notification
      notify("success", "Success",data.message || "Request processed successfully!");
  
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


export const configureLimApi = async (configData) => {
  try {
   
    const response = await axiosInstance.post("/llm-config/", configData);
    const data = response.data;

    // Show success notification
    notify("success", "Configuration Success", data.message || "Configuration applied successfully!");

    return data; // Return the response data
  } catch (error) {
    console.error("Error in configureLimApi:", error);

    // Show error notification
    notify(
      "error",
      "Configuration Failed",
      error.response?.data?.message || "An unexpected error occurred."
    );

    throw error; 
  }
};
export const sendPromptRequestapi = async (projectName, payload) => {
  // const url = `http://127.0.0.1:8000/code-transform/${projectName}`;

  try {
    const response = await axiosInstance.put(`/code-transform/${projectName}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    notify("success", "Code transform successful","");
    return response.data; // Axios automatically parses JSON
    
  } catch (error) {
    notify(
      "error",
      "Code transform failed",
      "An unexpected error occured"
    )
    
  }
 
  
};