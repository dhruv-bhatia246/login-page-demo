const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('./models/user_model');

passport.use(new localStrategy({usernameField: 'email'},(email,password,done)=>{
    const user = User.findOne({email: email}).then((user)=> {
        if(user==null){
            return done(null,false,{message:'wrong credentials'});
        }
        if(password == user.password){
            return done(null,user);
        }else{
            return done(null,false,{message: 'wrong password'});
        }
    });
}));

passport.serializeUser((user,done)=>done(null,user.id));
passport.deserializeUser((id,done)=>{
    const fetchUser = (id) => User.findById(id);
    fetchUser(id).then((user)=>{
        return done(null,user);
    })
})