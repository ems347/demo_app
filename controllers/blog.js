const Blog = require('../models/blog');

module.exports.index = async (req, res) => {
    const blogs = await Blog.find({})
    res.render('blogs/index', {blogs});
}

module.exports.renderNewBlogForm = (req, res) => {
    res.render('blogs/new')
}

module.exports.newBlog = async (req, res, next) => {
    const newBlogPost = new Blog(req.body);
    await newBlogPost.save();
    console.log(newBlogPost);
    req.flash('success', 'Success!');
    res.redirect(`blogs/${newBlogPost._id}`)
}

module.exports.renderBlog = async (req, res) => {
    const blogs = await Blog.findById(req.params.id);
    if(!blogs){
        req.flash('error', 'blog does not exist');
        return res.redirect('./');
    }
    res.render('blogs/show', {blogs})
}

module.exports.renderEditBlog = async (req, res) => {
    const blogs = await Blog.findById(req.params.id);
    res.render('blogs/edit', {blogs})
}

module.exports.editBlog = async (req, res) => {
    const blogs = await Blog.findByIdAndUpdate(req.params.id, req.body);
    console.log(req.body);
    req.flash('success', 'Success!');
    res.redirect(`./${blogs._id}`)
}

module.exports.deleteBlog = async (req, res) => {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    req.flash('success', 'Success!');
    res.redirect('./')
}
