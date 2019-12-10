const express=require('express');
const app=express();
const passportSetup=require('./config/passport-setup');
const mongoose=require('mongoose');
const mongodb=require('./config/keys').mongodb.URI;
const PORT=process.env.PORT||3000;
const authRoutes=require('./routes/auth-routes');
const cookieSession=require('cookie-session');
const keys=require('./config/keys');
const passport=require('passport');
const profile=require('./routes/profile-routes');
//set view engine
app.set('view engine','ejs');
app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:[keys.session.key]
}));
//initialize passport
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(mongodb,{useNewUrlParser:true,useUnifiedTopology: true},()=>{
    console.log('MongoDB connected')
})
app.get('/',(req,res)=>{
    res.render('home',{user:req.user})
});
app.use('/auth',authRoutes);
app.use('/profile',profile);
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})