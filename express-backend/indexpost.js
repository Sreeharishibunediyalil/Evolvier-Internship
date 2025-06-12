const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// In-memory articles array
const articles = [
  {
    id: 1,
    title: "Getting Started with Express.js",
    content: "Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web applications."
  },
  {
    id: 2,
    title: "GET",
    content: "Test GET."
  },
  {
    id: 3,
    title: "POST",
    content: "Test POST."
  }
];

// Routes
app.get('/api/first', (req, res) => {
  res.json({ message: 'Hello from the test route!' });
});

app.get('/api/test', (req, res) => {
  res.json(articles);
});

app.post('/api/articles', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newID = Math.max(...articles.map(article => article.id)) + 1;

  const newArticle = {
    id: newID,
    title,
    content
  };

  articles.push(newArticle);
  res.status(201).json(newArticle);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
