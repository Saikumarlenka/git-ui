import axiosInstance from "../axios/axiosInstance";
import { notify } from "../antd-components/Notify";

// API call to send data to `/ask-lm` endpoint


// API call to fetch repositories from `/repo-list` endpoint
export const fetchReposApi = async () => {
  try {
    const response = await axiosInstance.get("/repo-list");
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
