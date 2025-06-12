const mongoose = require('mongoose');


const articleSchema= new mongoose.Schema({
    title:{
        type: String,
        required: [true,'Title is required']
    },
    content:{
        type: String,
        required: [true,'Contents is required']
    },
    author:{
        type: String,
        required: [true,'Author is required']
    },
    Date:{
         type: Date,
        default: Date.now,
        required: true
    } 
})
const Article = mongoose.model("Article", articleSchema);
module.exports = Article;