require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URL;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.error(err);
  });

// Schema
const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', ArticleSchema);

// Routes
app.get('/api/first', (req, res) => {
  res.json({ message: 'Hello from the test route!' });
});

app.get('/api/test', async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

app.post('/api/articles', async (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.status(400).json({ error: 'Title, content and author are required' });
  }

  try {
    const newArticle = new Article({ title, content, author, date: new Date() });
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create article' });
  }
});

app.put('/api/articles/:id', async (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.status(400).json({ error: 'Title, content and author are required' });
  }

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { title, content, author },
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(updatedArticle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update article' });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);

    if (!deletedArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(deletedArticle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
