import { LayoutLanguage } from '@/models/common';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth-slice';
import coreReducer from './core/core-slice';

const savedLayoutLanguage = localStorage.getItem('currentLayoutLanguage');
const initialLayoutLanguage = savedLayoutLanguage
  ? (savedLayoutLanguage as LayoutLanguage)
  : LayoutLanguage.English;

// Create the preloaded state object with the initial layout language
const preloadedState = {
  core: {
    currentLayoutLanguage: initialLayoutLanguage
  }
};

/**
 * The Redux store configuration.
 * @remarks
 * This function creates a Redux store with the specified reducers and preloaded state.
 * @param reducer - The root reducer that combines all the individual reducers.
 * @param preloadedState - The initial state of the store.
 * @returns The configured Redux store.
 */
// Create the Redux store with the specified reducers and preloaded state
export const store = configureStore({
  reducer: {
    user: authReducer,
    core: coreReducer
  },
  preloadedState
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

store.subscribe(() => {
  // Get the current state
  const state = store.getState();
  // Save the current layout language to localStorage
  localStorage.setItem(
    'currentLayoutLanguage',
    state.core.currentLayoutLanguage
  );
});
