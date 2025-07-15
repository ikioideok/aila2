const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const gradeApi = require('./api/grade');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', gradeApi);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});