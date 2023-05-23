const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const blogSchema = new Schema({
    blogDescription: String,
    blogTitle: String,
});

module.exports = mongoose.model('Blog', blogSchema);