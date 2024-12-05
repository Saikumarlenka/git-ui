import axiosInstance from "../axios/axiosInstance";
import { notify } from "../antd-components/Notify";

// API call to send data to `/ask-lm` endpoint


// API call to fetch repositories from `/repo-list` endpoint
export const fetchReposApi = async () => {
  try {
    const response = await axiosInstance.get("/repository-list/");
    const data = response.data.data;

    // Show success notification
    notify("success", "Repositories Fetched", "Repository list loaded successfully!");

    return data;
  } catch (error) {
    console.error("Error in fetchReposApi:", error);

    notify(
      "error",
      "Failed to Fetch Repositories",
      error.response?.data?.message || "An unexpected error occurred."
    );

    throw error;
  }
};
export const deleteRepoApi = async (repoName) => {
  try {
    // Make the DELETE request to delete the repository
    const response = await axiosInstance.delete(`/delete-repository/${repoName}/False`);
    
    // Check response status and handle success
    if (response.status === 200) {
      notify("success", "Repository Deleted", "Repository deleted successfully!");
      return response.data;
    } else {
      // Handle unexpected statuses
      notify(
        "error",
        "Failed to Delete Repository",
        "An unexpected error occurred. Please try again."
      );
      return null;
    }
  } catch (error) {
    // Handle errors in the request
    notify(
      "error",
      "Failed to Delete Repository",
      error.response?.data?.message || "An unexpected error occurred while deleting the repository."
    );
    console.error('Error while deleting repository:', error); // Log the full error for debugging
    return null;
  }
};


// API call to send form data to `/index-repository` endpoint
export const indexRepositoryApi = async (formData) => {
  try {
    // Make the POST request with form data
    const response = await axiosInstance.post("/index-repository/", formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });

    // Handle success response
    if (response.status === 200) {
      notify("success", "Repository Indexed", response.data.message || "Repository indexed successfully!");
      return response.data; // Return the response data
    } else {
      notify(
        "error",
        "Failed to Index Repository",
        "An unexpected error occurred. Please try again."
      );
      return null;
    }
  } catch (error) {
    // Handle error scenarios
    notify(
      "error",
      "Failed to Index Repository",
      error.response?.data?.message || "An unexpected error occurred while indexing the repository."
    );
    console.error("Error while indexing repository:", error); // Log the full error for debugging
    return null;
  }
};
