import React, { useEffect, useMemo } from 'https://esm.sh/react@18.3.1';
import { useDispatch, useSelector } from 'https://esm.sh/react-redux@8.1.3';
import {
  store,
  fetchQuestions,
  setTopic,
  setDifficulty,
  setServerUrl,
  clearResults,
  toggleTheme,
  selectQuery,
  selectQuestions,
  selectTheme
} from './store.js';

export default function App() {
  const dispatch = useDispatch();
  const query = useSelector(selectQuery);
  const questionsState = useSelector(selectQuestions);
  const themeMode = useSelector(selectTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    try { localStorage.setItem('theme', themeMode); } catch (_) {}
  }, [themeMode]);

  const isFormValid = useMemo(() => {
    return Boolean(query.topic && query.difficulty && query.serverUrl);
  }, [query.topic, query.difficulty, query.serverUrl]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    dispatch(fetchQuestions({ topic: query.topic.trim(), difficulty: query.difficulty }));
  };

  return (
    <div className="container">
      <header>
        <h1>Question Browser</h1>
        <p>Query questions by topic and difficulty.</p>
        <div className="toolbar">
          <button type="button" className="theme-btn" onClick={() => dispatch(toggleTheme())}>
            {themeMode === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </header>

      <section className="controls">
        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="topic">Topic</label>
            <input
              id="topic"
              name="topic"
              type="text"
              placeholder="e.g. math, science"
              value={query.topic}
              onChange={(e) => dispatch(setTopic(e.target.value))}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={query.difficulty}
              onChange={(e) => dispatch(setDifficulty(e.target.value))}
              required
            >
              <option value="">Select...</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="serverUrl">Server URL</label>
            <input
              id="serverUrl"
              name="serverUrl"
              type="url"
              placeholder="http://localhost:3000"
              value={query.serverUrl}
              onChange={(e) => dispatch(setServerUrl(e.target.value))}
              required
            />
          </div>
          <div className="buttons">
            <button type="submit" disabled={!isFormValid || questionsState.status === 'loading'}>
              {questionsState.status === 'loading' ? 'Fetching…' : 'Fetch Questions'}
            </button>
            <button type="button" className="ghost" onClick={() => dispatch(clearResults())}>
              Clear
            </button>
          </div>
        </form>
      </section>

      <section className={`status ${questionsState.status === 'failed' ? 'error' : ''}`} aria-live="polite">
        {questionsState.status === 'idle' && ''}
        {questionsState.status === 'loading' && 'Fetching questions…'}
        {questionsState.status === 'succeeded' && `Fetched ${questionsState.items.length} question(s).`}
        {questionsState.status === 'failed' && (questionsState.error || 'Error fetching questions')}
      </section>

      <section className="results">
        <h2>Results</h2>
        <ul id="results">
          {questionsState.items.length === 0 && (
            <li className="empty">No questions to display.</li>
          )}
          {questionsState.items.map((q, idx) => (
            <li key={idx}>{q}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}