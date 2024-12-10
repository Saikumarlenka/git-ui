import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { askLmApi,configureLimApi ,sendPromptRequestapi} from "../../services/promptService";

const initialState = {
  transformedCode:null,
  configirations:{},
  status: "idle",
  error: null,
  
};

export const sendPrompt = createAsyncThunk("prompts/sendPrompt", async ({ repoId, promptData }, thunkAPI) => {
  try {
    const response = await askLmApi(promptData);
    return { repoId, prompt: response };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to process the prompt");
  }
});
export const configureLim = createAsyncThunk("configirations/configurellm" , async (configData,{rejectWithValue})=>{
  try {
    const response = await configureLimApi(configData);
    return response;

    
  } catch (error) {
    return rejectWithValue(error.response?.data|| "Failed to configure the LLM")
    
  }
})
export const sendPromptToApi = createAsyncThunk(
  "codeTransform/sendPrompt",
  async (payload, { rejectWithValue }) => {
    try {
      // Payload now contains both the prompt and project_name
      const response = await sendPromptRequestapi(payload); 
      return response; 
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

const promptSlice = createSlice({
  name: "prompts",
  initialState,
  reducers: {
    addPrompt: (state, action) => {
      const { repoId, prompt } = action.payload;
      if (!state.prompts[repoId]) {
        state.prompts[repoId] = [];
      }
      state.prompts[repoId].push(prompt);
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(sendPromptToApi.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.transformedCode = null;
    })
    .addCase(sendPromptToApi.fulfilled, (state, action) => {
      state.isLoading = false;
      state.transformedCode = action.payload;
    })
    .addCase(sendPromptToApi.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
      .addCase(configureLim.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(configureLim.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.configirations={...state.configirations, ...action.payload};
       
      })
      .addCase(configureLim.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });;
  },
});

export const { addPrompt } = promptSlice.actions;
export const selectPromptsByRepo = (state, repoId) => state.prompts.prompts[repoId] || [];
export const selectPromptStatus = (state) => state.prompts.status;
export const selectPromptError = (state) => state.prompts.error;
export const selecttransformedcode = (state)=> state.prompts.transformedCode


export default promptSlice.reducer;
