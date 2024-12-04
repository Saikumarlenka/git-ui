import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchReposApi } from "../../services/repoService";

const initialState = {
  repos: [],
  currentRepo: null,
  status: "idle",
  error: null,
};

export const fetchAllRepos = createAsyncThunk("repos/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await fetchReposApi();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch repositories");
  }
});

const repoSlice = createSlice({
  name: "repos",
  initialState,
  reducers: {
    setCurrentRepo: (state, action) => {
      state.currentRepo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRepos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllRepos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.repos = action.payload;
      })
      .addCase(fetchAllRepos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setCurrentRepo } = repoSlice.actions;
export const selectAllRepos = (state) => state.repos.repos;
export const selectCurrentRepo = (state) => state.repos.currentRepo;
export const selectRepoStatus = (state) => state.repos.status;
export const selectRepoError = (state) => state.repos.error;

export default repoSlice.reducer;
