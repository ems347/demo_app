const express = require('express');
const multer = require('multer');


const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { storage } = require('../utils/cloudinary');
const submissions = require('../controllers/submissions');
const {isLoggedIn, validatePlastic} = require('../middleware');

const router = express.Router();
const app = express();
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(submissions.index))
    .post(upload.array('image'), validatePlastic, catchAsync(submissions.newSubmission))

router.route('/new')
    .get(submissions.renderNewSubmissionForm)

router.route('/:id')
    .get(catchAsync(submissions.renderSubmission))
    .put(validatePlastic, isLoggedIn, catchAsync(submissions.editSubmission))
    .delete(catchAsync(submissions.deleteSubmission))


router.route('/:id/edit')
    .get(isLoggedIn, catchAsync(submissions.renderEditForm))


module.exports = router;