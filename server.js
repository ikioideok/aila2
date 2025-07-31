require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(express.json());

// Mount the grade API under /api/grade
const gradeApi = require('./api/grade');
app.use('/api/grade', gradeApi);

// Serve static assets from the public folder at /public
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve page templates.  By mounting express.static on the pages
// directory we allow users to access /pages/whatever.html directly.
app.use(express.static(path.join(__dirname, 'pages')));

// Route the root URL to our home page.  Without this the root
// would attempt to resolve ./index.html from the project root which
// does not exist.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});