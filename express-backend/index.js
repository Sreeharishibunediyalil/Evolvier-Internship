const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Article = require("./schema"); // ✅ Importing Article model

dotenv.config(); // ✅ Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

console.log("MONGO_URL from .env:", process.env.MONGO_URL);

const mongoURI = process.env.MONGO_URL;

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.use(express.json());

// ✅ Create Article
app.post("/api/articles", async (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.status(400).json({ error: "Title, content, and author are required" });
  }
  try {
    const newArticle = new Article({ title, content, author });
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ error: "Failed to create article" });
  }
});

// ✅ Get All Articles
app.get("/api/articles", async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// ✅ Patch (Partial Update)
app.patch("/api/articles/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "At least one field is required to update" });
  }

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.status(200).json({
      message: "Article updated successfully",
      updatedArticle,
    });
  } catch (error) {
    console.error("Error patching article:", error);
    res.status(500).json({ error: "Server error while updating the article" });
  }
});

// ✅ Put (Full Update)
app.put("/api/articles/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({ error: "All fields (title, content, author) are required" });
  }

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { title, content, author },
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.status(200).json({
      message: "Article updated successfully",
      updatedArticle,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ error: "Server error while updating the article" });
  }
});

// ✅ Delete Article
app.delete("/api/articles/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.status(200).json({
      message: "Article deleted successfully",
      deletedArticle,
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ error: "Server error while deleting the article" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
