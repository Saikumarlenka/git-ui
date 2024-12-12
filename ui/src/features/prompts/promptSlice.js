import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { askLmApi, configureLimApi, sendPromptRequestapi, commitapi } from "../../services/promptService"; // Import commitapi

const initialState = {
  transformedCode: null,
  transfromcodestatus:"idle",
  configurations: {},
  status: "idle",
  error: null,
  commitStatus: "idle",  // Added for commit status
  commitError: null,
  commitresponse:null
    // Added for commit error
};



export const configureLim = createAsyncThunk("configurations/configureLlm", async (configData, { rejectWithValue }) => {
  try {
    const response = await configureLimApi(configData);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to configure the LLM");
  }
});

export const sendPromptToApi = createAsyncThunk(
  "codeTransform/sendPrompt",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await sendPromptRequestapi(payload);
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

// New async thunk for commit API call
export const commitCode = createAsyncThunk(
  "codeCommit/commitCode",  // Unique name for the commit API action
  async (id, { rejectWithValue }) => {
    try {
      const response = await commitapi(id);
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Commit failed";
      return rejectWithValue(errorMessage);
    }
  }
);

const promptSlice = createSlice({
  name: "prompts",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendPromptToApi.pending, (state) => {
        state.transfromcodestatus = "loading";
        state.error = null;
      })
      .addCase(sendPromptToApi.fulfilled, (state, action) => {
        
        state.transformedCode = action.payload;
        state.transfromcodestatus = "succeeded";
      })
      .addCase(sendPromptToApi.rejected, (state, action) => {
        state.transfromcodestatus="failed"
        state.error = action.payload;
      })
      .addCase(configureLim.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(configureLim.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.configurations = { ...state.configurations, ...action.payload };
      })
      .addCase(configureLim.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Adding handlers for the commitCode async thunk
      .addCase(commitCode.pending, (state) => {
        state.commitStatus = "loading";  // Set commit loading state
        state.commitError = null;
      })
      .addCase(commitCode.fulfilled, (state, action) => {
        state.commitStatus = "succeeded";  // Set commit success state
        state.commitresponse=action.payload;
      })
      .addCase(commitCode.rejected, (state, action) => {
        state.commitStatus = "failed";  // Set commit failed state
        state.commitError = action.payload;
      });
  },
});


export const selectPromptStatus = (state) => state.prompts.status;
export const selectPromptError = (state) => state.prompts.error;
export const selectTransformedCode = (state) => state.prompts.transformedCode;
export const selectCommitStatus = (state) => state.prompts.commitStatus;  // Selector for commit status
export const selectCommitError = (state) => state.prompts.commitError;  // Selector for commit error
export const selectTransformedCodestatus = (state)=> state.prompts.transfromcodestatus;
export const selectCommitResponse = (state)=> state.prompts.commitresponse;
export const selectllmstatus = ( state)=> state.prompts.status
export const promprerror = (state)=> state.prompts.error

export default promptSlice.reducer;
