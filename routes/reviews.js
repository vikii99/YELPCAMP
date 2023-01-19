const express = require('express')
const router = express.Router({mergeParams: true})
const { validateReview, isLoggedIn, isReviewAuthor, isAuthor } = require('../middleware');

const catchAsync = require('../utilities/catchAsync')
const ExpressErrors = require('../utilities/ExpressErrors')

const Campground = require('../models/campgrounds')
const Review = require('../models/reviews')

const { reviewSchema } = require('../schemas.js');
const reviews = require('../controllers/reviews')



router.post('/', isLoggedIn,   catchAsync(reviews.newReview))


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router