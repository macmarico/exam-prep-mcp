(function () {
  const form = document.getElementById('query-form');
  const resultsList = document.getElementById('results');
  const statusEl = document.getElementById('status');
  const topicInput = document.getElementById('topic');
  const difficultySelect = document.getElementById('difficulty');
  const serverUrlInput = document.getElementById('serverUrl');

  function setStatus(message, className) {
    statusEl.textContent = message || '';
    statusEl.className = `status ${className || ''}`.trim();
  }

  function renderResults(questions) {
    resultsList.innerHTML = '';
    if (!Array.isArray(questions) || questions.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No questions found.';
      li.className = 'empty';
      resultsList.appendChild(li);
      return;
    }

    for (const q of questions) {
      const li = document.createElement('li');
      li.textContent = typeof q === 'string' ? q : JSON.stringify(q);
      resultsList.appendChild(li);
    }
  }

  async function submitQuery(event) {
    event.preventDefault();
    const serverUrl = serverUrlInput.value.replace(/\/$/, '');
    const topic = topicInput.value.trim();
    const difficulty = difficultySelect.value;

    if (!serverUrl || !topic || !difficulty) {
      setStatus('Please fill in all fields.', 'error');
      return;
    }

    setStatus('Fetching questions…');

    try {
      const response = await fetch(`${serverUrl}/question.fetch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errMsg = data && data.error ? data.error : `Request failed with ${response.status}`;
        setStatus(errMsg, 'error');
        renderResults([]);
        return;
      }

      const questions = Array.isArray(data?.questions)
        ? data.questions.map(item => (typeof item === 'string' ? item : item?.question || JSON.stringify(item)))
        : [];

      setStatus(`Fetched ${questions.length} question(s).`);
      renderResults(questions);
    } catch (error) {
      setStatus(`Network error: ${error?.message || error}`, 'error');
      renderResults([]);
    }
  }

  form.addEventListener('submit', submitQuery);
})();