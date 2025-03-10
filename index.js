if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const multer = require('multer');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const MongoDBStore = require('connect-mongo');

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const upload = multer({dest: 'uploads/' });
const Plastic = require('./models/plastics');
const { findById } = require("./models/plastics");
const {plasticSchema} = require('./schemas.js');
const submissionRoutes = require('./routes/submissions');
const Blog = require('./models/blog');
const blogRoutes = require('./routes/blog');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const isLoggedIn = require('./middleware')



const app = express();
const port = process.env.PORT || 3000



const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/plasticsApp'


mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})


app.engine('ejs', engine);
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const store = new MongoDBStore({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
  });

store.on("error", function (e) {
    console.log("session store error", e)
});

const secret = process.env.SECRET || 'secretsecret'

const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 *60 *60 *24 *7,
        maxAge: 1000 *60 *60 *24 *7
    },
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/submissions', submissionRoutes);
app.use('/blogs', blogRoutes);

app.get('/', async (req, res) => {
    const plastics = await Plastic.find({})
    const blogs = await Blog.find({})
    res.render('home', {plastics, blogs})
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const {statusCode =500} =  err;
    if(!err.message) err.message = 'Something went wrong'; 
    res.status(statusCode).render('error', {err});
  });


app.listen(port, () => {
    console.log(`listening on ${port}`)
});


