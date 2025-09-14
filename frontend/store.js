import { configureStore, createSlice, createAsyncThunk } from 'https://esm.sh/@reduxjs/toolkit@2.2.7';

function safeGetLocalStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value != null ? value : fallback;
  } catch (_) {
    return fallback;
  }
}

export const fetchQuestions = createAsyncThunk(
  'questions/fetchQuestions',
  async ({ topic, difficulty }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const serverUrl = String(state.query.serverUrl || '').replace(/\/$/, '');
      const response = await fetch(`${serverUrl}/question.fetch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = data && data.error ? data.error : `Request failed with ${response.status}`;
        return rejectWithValue(message);
      }
      const questions = Array.isArray(data?.questions)
        ? data.questions.map(item => (typeof item === 'string' ? item : item?.question || JSON.stringify(item)))
        : [];
      return questions;
    } catch (error) {
      return rejectWithValue(error?.message || String(error));
    }
  }
);

const querySlice = createSlice({
  name: 'query',
  initialState: {
    topic: '',
    difficulty: '',
    serverUrl: 'http://localhost:3000'
  },
  reducers: {
    setTopic(state, action) { state.topic = action.payload; },
    setDifficulty(state, action) { state.difficulty = action.payload; },
    setServerUrl(state, action) { state.serverUrl = action.payload; }
  }
});

const questionsSlice = createSlice({
  name: 'questions',
  initialState: { status: 'idle', error: null, items: [] },
  reducers: {
    clearResults(state) { state.items = []; state.error = null; state.status = 'idle'; }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.items = [];
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload || [];
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unknown error';
      });
  }
});

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: safeGetLocalStorage('theme', 'dark') },
  reducers: {
    toggleTheme(state) { state.mode = state.mode === 'dark' ? 'light' : 'dark'; },
    setTheme(state, action) { state.mode = action.payload === 'light' ? 'light' : 'dark'; }
  }
});

export const { setTopic, setDifficulty, setServerUrl } = querySlice.actions;
export const { clearResults } = questionsSlice.actions;
export const { toggleTheme, setTheme } = themeSlice.actions;

export const store = configureStore({
  reducer: {
    query: querySlice.reducer,
    questions: questionsSlice.reducer,
    theme: themeSlice.reducer
  }
});

export function selectQuery(state) { return state.query; }
export function selectQuestions(state) { return state.questions; }
export function selectTheme(state) { return state.theme.mode; }