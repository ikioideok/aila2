require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/', async (req, res) => {
  try {
    const { q31Text, q32Text } = req.body;

    if (!q31Text || !q32Text) {
      return res.status(400).json({ error: 'q31Text と q32Text が必要です' });
    }

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
最初に、Q31とQ32の各評価観点ごとの点数（5段階評価）をJSON形式で出力してください。JSON以外の説明は含めず、必ず\`\`\`json と \`\`\` で囲んでください。
その後、改行を挟んでから、各問題の合計点と、良かった点や改善点を具体的に示す詳細な講評を記述してください。講評は必ず「Q31」と「Q32」のキーワードから始めてください。

例:
\`\`\`json
{"q31_scores": {"自然さ": 4, "意味の正確さ": 5, "プロらしさ": 3, "簡潔性": 4, "読者への配慮": 5}, "q32_scores": {"論理構成": 5, "表現力": 4, "テーマ性": 5, "独創性": 3, "説得力": 4}}
\`\`\`
Q31 編集実技: 合計21点
講評：元の文章の意図を正確に捉えつつ、より自然な表現に修正できています。特に「〜」という部分の修正は素晴らしいです。一方で、「〜」は少し硬い印象を与えるため、「〜」のようにすると、よりプロフェッショナルな文章になるでしょう。

Q32 200字ライティング: 合計21点
講評：テーマに沿った内容で、論理的な構成も優れています。独創的な視点も評価できます。しかし、説得力をさらに高めるために、具体的な事例を一つ加えるなどの工夫があると、より読者の心に響く文章になります。
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: systemPrompt }],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `OpenAI APIエラー: ${errText}` });
    }

    const data = await response.json();
    const gptResponseContent = data.choices[0].message.content;

    // クライアント側で表示できるようにそのまま返す
    res.status(200).json({ gptResponse: gptResponseContent });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'サーバーエラーが発生しました。' });
  }
});

module.exports = router;
