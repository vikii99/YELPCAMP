if (process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}


const express = require('express')
const app = express()
const path = require('path')
const Joi = require('joi')
const catchAsync = require('./utilities/catchAsync')
const ExpressErrors = require('./utilities/ExpressErrors')
const mongoose = require('mongoose')
const { campgroundSchema } = require('./schemas.js');
const { reviewSchema } = require('./schemas.js');
const Campground = require('./models/campgrounds')
const Review = require('./models/reviews')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const { join } = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanatize = require('express-mongo-sanitize')
const helmet = require('helmet')

const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')
const usersRoutes = require('./routes/users')

app.engine('ejs', ejsMate)
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanatize())



const sessionCon = {
    name: 'session',
    secret: 'somethingjustlikethis',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() +1000 * 60* 60* 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionCon))
app.use(flash())
app.use(helmet({
    crossOriginEmbedderPolicy: false
}));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dba8utuyf/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);




app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) => {
    
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open',() => {
    console.log("DB connected")
})

app.set('views', path.join(__dirname, 'views')  )
app.set('view engine', 'ejs')


//Routes
app.get('/', (req,res)=> {
    res.render('home')
})

app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)
app.use('/',usersRoutes)



app.all('*' , (req,res,next) => {
    next(new ExpressErrors('Page Not Found', 404))
    console.log(res.message)
})

app.use((err,req,res,next) => {
    const {status = 500 } = err;
    if(!err.message) err.message = 'Something went wrong'
    res.status(status).render('error', {err})
})

app.listen(4000, ()=>{
    console.log('on port 4000')
})