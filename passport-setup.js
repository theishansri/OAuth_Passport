const passport=require('passport');
const GoogleStrategy=require('passport-google-oauth20');
const keys=require('./keys');
const User=require('../models/users.models');

passport.serializeUser((user,done)=>{
    done(null,user.id)
});
passport.deserializeUser(async (id,done)=>{
    try{
        const user=await User.findById(id)
        if(user){
            done(null,user)
        }
    }
    catch(err){
        console.log(err.message)
    }
    
})
passport.use(new GoogleStrategy({
    //options for google Strategy
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "/auth/google/redirect"
},async (acesstoken,refreshtoken,profile,done)=>{
    //Passport callback function
    // console.log(profile)
    // if(User.findById(profile.sub))
    const find=await User.findOne({googleid:profile.id})
    if(find){
        //already has that user
        console.log(`user is ${find}`)
        done(null,find)
    }
    else{
    const new_user=new User({
        userName:profile.displayName,
        googleid:profile.id,
        picture:profile._json.picture
    })
    let saveuser=await new_user.save();
    console.log(`New User created ${saveuser,new_user}`);

    done(null,new_user)
}
}));

module.exports=passport;
