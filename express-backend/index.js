const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/first', (req, res) => {
  res.json({ message: 'Hello from the test route!' });
});

app.get('/api/test', (req, res) => {
  res.json(articles);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/api/articles', (req,res) => {
const{title, content} = req.body;
  if(!title || !content) {
  return res.status(400).json({ eorror : 'Title and content are required'});
  }
  const newID= Math.max(...articles.map(articles => articles.id))+1;
  const newArticle = {
    id: newID,
    title,
    content
  };
  articles.push(newArticle);
  res.status(201).json(newArticle);
});

app.delete('/api/articles/:id', (req, res) => {
const id = parseInt(req.params.id);
const index = articles.findIndex (articles => articles.id === id);

if (index === -1){
  return res.status(404).json({ error: 'Article not found'});
}

const deletedArticle = articles.splice(index, 1)[0];
res.json(deletedArticle);
});

app.put('/api/articles/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;

  if(!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const article = articles.find(article => article.id === id);

  if (!article) {
    return res.status(404).json({ error: 'Article NOT FOUND' })
  }
  article.title = title;
  article.content = content;
  res.json(article);
});

const articles =[
  {
    id: 1,
    title: "Getting Started with Express.js",
    content: "Express.js is  minimal and flexible Node.js web application framework that provides a robust set of features for web applications."
  },
    {
    id: 2,
    title: "GET",
    content: "Test GET."
  },  {
    id: 3,
    title: "POST",
    content: "Test POST."
  }
];