const express = require('express');
const passport = require('passport');
const User = require('./models/user_model')
const connection = require('./connection');
const app = express();
const flash = require('express-flash');
const session = require('express-session');
const passport_config = require('./passport-config');
const methodOverride = require('method-override');

connection();
app.use(flash());
app.use(methodOverride('_method'));
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false

}));
app.use(express.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view-engine', 'ejs');

app.get('/',(req, res) => res.render('home.ejs', {user: req.user}));
app.get('/login',isguest,(req, res) => res.render('login.ejs'));
app.get('/register',isguest,(req, res) => res.render('register.ejs'));
app.get('/profile',loggedIn, (req,res)=> res.render('profile.ejs',{user:req.user}));

app.post('/register', isguest, (req,res) => {
    //add user to database
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save().then(()=>{
        console.log("user saved in db");
        res.redirect('login');
    })
})

app.post('/login',isguest, passport.authenticate('local',{
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}))

app.delete('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/login');
})

function loggedIn(req,res,next){
    if(req.user){
        next();
    }else{
        res.redirect('/login');
    }
}

function isguest(req, res, next){
    if(req.user){
        res.redirect('/profile');
    }else{
        next();
    }
}

app.listen(3000);