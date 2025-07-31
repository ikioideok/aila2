// Client side logic for the AI writer certification exam
//
// This script wires up the exam page to the back‑end grading API.  It
// listens for clicks on the submit button, sends the candidate’s
// answers to /api/grade, parses the JSON portion of the response and
// then displays both the human readable feedback and two radar
// charts.  The charts use Chart.js which should be loaded via CDN on
// the exam page.

document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submitBtn');
  const resultElem = document.getElementById('ai-score-result');

  if (!submitBtn || !resultElem) {
    console.error('submitBtn または ai-score-result が見つかりません。');
    return;
  }

  submitBtn.addEventListener('click', async () => {
    const q31Text = document.getElementById('q31Text').value;
    const q32Text = document.getElementById('q32Text').value;

    // Clear any previous result
    resultElem.innerHTML = '';

    const response = await fetch('/api/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q31Text, q32Text })
    });

    if (!response.ok) {
      const error = await response.json();
      resultElem.textContent = `エラー: ${error.error}`;
      return;
    }

    const data = await response.json();
    const content = data.gptResponse;

    // Extract JSON portion from the GPT response
    const match = content.match(/```json([\s\S]*?)```/);
    let scores = null;
    if (match) {
      try {
        scores = JSON.parse(match[1].trim());
      } catch (e) {
        resultElem.textContent = 'JSONパースに失敗しました。';
        return;
      }
    }

    // Display the feedback text excluding the JSON codeblock
    const reviews = content.replace(/```json[\s\S]*?```/, '').trim();
    resultElem.textContent = reviews;

    // Draw radar charts if we have parsed scores
    if (scores) {
      createRadarChart('q31RadarChart', '編集実技', [
        scores.q31_scores?.['自然さ'],
        scores.q31_scores?.['意味の正確さ'],
        scores.q31_scores?.['プロらしさ'],
        scores.q31_scores?.['簡潔性'],
        scores.q31_scores?.['読者への配慮']
      ]);

      createRadarChart('q32RadarChart', '200字ライティング', [
        scores.q32_scores?.['論理構成'],
        scores.q32_scores?.['表現力'],
        scores.q32_scores?.['テーマ性'],
        scores.q32_scores?.['独創性'],
        scores.q32_scores?.['説得力']
      ]);
    }
  });
});

// Helper function to create a radar chart.  Expects a canvas element
// with the given id and Chart.js loaded on the page.
function createRadarChart(canvasId, label, data) {
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) {
    console.error(`Canvas要素 ${canvasId} が見つかりません`);
    return;
  }

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['①', '②', '③', '④', '⑤'],
      datasets: [{
        label: label,
        data: data,
        fill: true,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)'
      }]
    },
    options: {
      responsive: false,
      scales: {
        r: {
          min: 0,
          max: 5,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}