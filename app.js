var express= require ("express");
var mongoose= require ("mongoose");
var passport= require("passport");
var user= require("./models/user");
var bodyParser=require("body-parser");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
mongoose.connect("mongodb:/localhost/auth_demo_app");
var app= express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret:"This is the secret page",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.get("/",function(req,res){
   res.render("home.ejs");
});

app.get("/secret",function(req,res){
   res.render("secret"); 
});
app.get("/register",function(req,res){
   res.render("register"); 
});
app.post("/register",function(req,res)
{
   req.body.username;
   req.body.password;
   user.register(new user({username: req.body.username}),req.body.password,function(err,user){
      if(err){
          console.log(err);
          return res.render("register");
      } 
      passport.authenticate("local")(req,res,function(){
          res.redirect("/secret");
      });
   });
});
//Login
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",passport.authenticate("local",{
    sucessRedirect:"/secret",
    failureRedirect:"/login"
}),function(req,res){
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server Started........");
});
 