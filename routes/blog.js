const express = require('express');
const multer = require('multer');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { storage } = require('../utils/cloudinary');
const blogs = require('../controllers/blog');
const {isLoggedIn} = require('../middleware');

const router = express.Router();
const app = express();


router.route('/')
    .get(catchAsync(blogs.index))
    .post(isLoggedIn, catchAsync(blogs.newBlog))

router.route('/new')
    .get(blogs.renderNewBlogForm)


router.route('/:id')
    .get(catchAsync(blogs.renderBlog))
    .put(isLoggedIn, catchAsync(blogs.editBlog))
    .delete(catchAsync(blogs.deleteBlog))


router.route('/:id/edit')
    .get(isLoggedIn, catchAsync(blogs.renderEditBlog))

router.route('/blogs')
    .get(catchAsync(blogs.renderBlog))

module.exports = router;