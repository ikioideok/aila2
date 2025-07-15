document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submitBtn');
  const resultElem = document.getElementById("ai-score-result");

  if (!submitBtn || !resultElem) {
    console.error('submitBtn または ai-score-result が見つかりません。');
    return;
  }

  submitBtn.addEventListener('click', async () => {
    const q31Text = document.getElementById('q31Text').value;
    const q32Text = document.getElementById('q32Text').value;

    resultElem.innerHTML = ''; // 前の結果クリア

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
    const reviews = content.replace(/```json[\s\S]*?```/, '').trim();
    resultElem.textContent = reviews;

    // レーダーチャート描画
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

// レーダーチャート描画関数
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
