// API route for grading AI writer responses
//
// This module exposes a single POST endpoint that receives two pieces of
// user‑supplied text (q31Text and q32Text) and forwards them to the
// OpenAI Chat API for scoring. The system prompt instructs the AI
// model to rate each response on several criteria and return a JSON
// object along with human‑readable feedback.  The returned JSON and
// feedback are then passed directly back to the client.  Any errors
// encountered when calling the OpenAI API are surfaced to the client.

require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// POST /api/grade
router.post('/', async (req, res) => {
  try {
    const { q31Text, q32Text } = req.body;
    if (!q31Text || !q32Text) {
      return res.status(400).json({ error: 'q31Text と q32Text が必要です' });
    }

    // Define the system prompt for the AI model.  It instructs the
    // model to score each answer on five criteria and then output a
    // JSON object followed by narrative feedback.  The JSON must be
    // wrapped in ```json fences to allow the client to parse it
    // safely.
    const systemPrompt = `
あなたはAIライター試験の厳格な採点者です。
以下の2つの回答について、それぞれの評価観点に基づき5点満点で採点し、合計点と具体的な講評を出力してください。

■Q31 編集実技（元の文の修正）
[元文]
AIは未来のライティングを変革します。それは効率性を高め、創造性を刺激します。しかし、人間の介入は不可欠です。なぜなら、AIは感情やニュアンスを完全に理解できないからです。最終的な品質は人間の編集に依存します。

[受験者の回答]
${q31Text}

[評価観点]
- 自然さ (Naturalness)
- 意味の正確さ (Accuracy of Meaning)
- プロらしさ (Professionalism)
- 簡潔性 (Conciseness)
- 読者への配慮 (Reader Consideration)

■Q32 200字ライティング（テーマ：未来の働き方）
[受験者の回答]
${q32Text}

[評価観点]
- 論理構成 (Logical Structure)
- 表現力 (Expressiveness)
- テーマ性 (Thematic Relevance)
- 独創性 (Originality)
- 説得力 (Persuasiveness)

【出力形式】
最初に、Q31とQ32の各評価観点ごとの点数（5段階評価）をJSON形式で出力してください。JSON以外の説明は含めず、必ず```json と ``` で囲んでください。
その後、改行を挟んでから、各問題の合計点と、良かった点や改善点を具体的に示す詳細な講評を記述してください。講評は必ず「Q31」と「Q32」のキーワードから始めてください。
`;

    // Call OpenAI Chat API.  The model name and API key are pulled
    // from environment variables.  Temperature is kept low to
    // encourage deterministic scoring.
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: systemPrompt }],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `OpenAI APIエラー: ${errText}` });
    }

    const data = await response.json();
    const gptResponseContent = data.choices[0].message.content;
    res.status(200).json({ gptResponse: gptResponseContent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'サーバーエラーが発生しました。' });
  }
});

module.exports = router;