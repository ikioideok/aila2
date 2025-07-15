document.getElementById('submitBtn').addEventListener('click', async () => {
  const q31Text = document.getElementById('q31Text').value;
  const q32Text = document.getElementById('q32Text').value;

  const response = await fetch('/api/grade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q31Text, q32Text })
  });

  const resultElem = document.getElementById("ai-score-result");
  resultElem.innerHTML = ''; // 前の結果クリア

  if (!response.ok) {
    const error = await response.json();
    resultElem.textContent = `エラー: ${error.error}`;
    return;
  }

  const data = await response.json();
  const content = data.gptResponse;

  // JSON部分だけ抜き出す
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

  // 残りの講評テキストだけ表示
  const reviews = content.replace(/```json[\s\S]*?```/, '');
  resultElem.textContent = reviews;

  if (scores) {
    createRadarChart('q31RadarChart', '編集実技', [
      scores.Q31['自然さ'],
      scores.Q31['意味の正確さ'],
      scores.Q31['プロらしさ'],
      scores.Q31['簡潔性'],
      scores.Q31['読者への配慮']
    ]);
    createRadarChart('q32RadarChart', '200字ライティング', [
      scores.Q32['論理構成'],
      scores.Q32['表現力'],
      scores.Q32['テーマ性'],
      scores.Q32['独創性'],
      scores.Q32['説得力']
    ]);
  }
});

// レーダーチャート描画関数
function createRadarChart(canvasId, label, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['①', '②', '③', '④', '⑤'],
      datasets: [{
        label: label,
        data: data,
        fill: true
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
