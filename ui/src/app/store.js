import { configureStore } from "@reduxjs/toolkit";

import repoReducer from "../features/repo/repoSlice";
import promptReducer from "../features/prompts/promptSlice";

export const store = configureStore({
  reducer: {
    
    repos: repoReducer,
    prompts: promptReducer,
  },
});
