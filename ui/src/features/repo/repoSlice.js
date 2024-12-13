import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteRepoApi, fetchReposApi, indexRepositoryApi } from "../../services/repoService";

const initialState = {
  repos: [],
  currentRepo: null,
  status: "idle",
  loading: false,
  error: null,
  indexing_status:"idle",
  successMessage: null,
};

export const fetchAllRepos = createAsyncThunk("repos/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await fetchReposApi();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch repositories");
  }
});

export const deleteRepo = createAsyncThunk(
  "repository/deleteRepo",
  async (repoName, { rejectWithValue }) => {
    try {
      const response = await deleteRepoApi(repoName);
      return { message: response.message, repoName };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete repository");
    }
  }
);

export const indexRepo = createAsyncThunk(
  "repository/indexRepo",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await indexRepositoryApi(formData);
      return response; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to index repository");
    }
  }
);

const repoSlice = createSlice({
  name: "repos",
  initialState,
  reducers: {
    setCurrentRepo: (state, action) => {
      state.currentRepo = action.payload;
    },
    resetState: (state) => {
      state.loading = false;
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all repositories
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
      })

      // Delete repository
      .addCase(deleteRepo.pending, (state) => {
        state.loading = true;
        
        state.successMessage = null;
        state.error = null;
      })
      .addCase(deleteRepo.fulfilled, (state, action) => {
        state.loading = false;
      
        state.successMessage = action.payload.message;
        state.repos = state.repos.filter(
          (repo) => repo.project_name !== action.payload.repoName
        );
      })
      .addCase(deleteRepo.rejected, (state, action) => {
        state.loading = false;
       
        state.successMessage = null;
        state.error = action.payload;
      })

      // Index repository
      .addCase(indexRepo.pending, (state) => {
        state.indexing_status = "loading";
        state.successMessage = null;
        state.error = null;
        
      })
      .addCase(indexRepo.fulfilled, (state, action) => {
       
        state.successMessage = action.payload.message || "Repository indexed successfully!";
        state.repos.push(action.payload.repository); 
        state.indexing_status="succeeded"
      
      })
      .addCase(indexRepo.rejected, (state, action) => {
        state.indexing_status="failed"
      
        state.successMessage = null;
        state.error = action.payload;
      });
  },
});

export const { setCurrentRepo, resetState } = repoSlice.actions;

export const selectAllRepos = (state) => state.repos.repos;
export const selectCurrentRepo = (state) => state.repos.currentRepo;
export const selectRepoStatus = (state) => state.repos.status;
export const selectRepoError = (state) => state.repos.error;
export const selectSuccessMessage = (state) => state.repos.successMessage;
export const selectLoading = (state)=>state.repos.loading
export const selectindexingstatus=(state) => state.repos.indexing_status

export default repoSlice.reducer;
