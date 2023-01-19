const { model } = require('mongoose')
const Campground = require('../models/campgrounds')
const Review = require('../models/reviews')

module.exports.newReview = async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req,res) => {
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}