require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

// POSTリクエストのbodyをJSONで受け取れるようにする
app.use(express.json());

// 静的ファイル（HTMLやCSS、JS）をpublicフォルダから提供
app.use(express.static('public'));

// ここで /api/grade をルーティングに追加
const gradeApi = require('./api/grade');
app.use('/api/grade', gradeApi);

// サーバー起動
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
