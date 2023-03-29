const express = require('express')
const router = express.Router()
const catchAsync = require('../utilities/catchAsync')
const ExpressErrors = require('../utilities/ExpressErrors')
const { campgroundSchema } = require('../schemas.js');
const Campground = require('../models/campgrounds')
const {isLoggedIn, isAuthor} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage })
const {validateCampground} = require("../middleware")




router.route('/')
    .get( campgrounds.index )
    .post(isLoggedIn,upload.array('image'), catchAsync(campgrounds.createCampground))
    

router.get('/new',isLoggedIn, campgrounds.renderNewForm)

router.get('/:id/edit',isLoggedIn, isAuthor, campgrounds.renderEditForm)

router.route('/:id')
    .get(campgrounds.showCampground)
    .put(isLoggedIn, isAuthor, upload.array('image'),catchAsync( campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router
