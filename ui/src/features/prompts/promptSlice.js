import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { askLmApi } from "../../services/promptService";

const initialState = {
  prompts: {},
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
      .addCase(sendPrompt.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendPrompt.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { repoId, prompt } = action.payload;
        if (!state.prompts[repoId]) {
          state.prompts[repoId] = [];
        }
        state.prompts[repoId].push(prompt);
      })
      .addCase(sendPrompt.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { addPrompt } = promptSlice.actions;
export const selectPromptsByRepo = (state, repoId) => state.prompts.prompts[repoId] || [];
export const selectPromptStatus = (state) => state.prompts.status;
export const selectPromptError = (state) => state.prompts.error;

export default promptSlice.reducer;
