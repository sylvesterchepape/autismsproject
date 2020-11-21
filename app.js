var express= require("express"),
    app  =express(),
    bodyParser=require('body-parser'),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    bodyParser = require("body-parser"),

    passportLocalMongoose = require("passport-local-mongoose")
    User      = require("./models/user"),
    Course     = require("./models/courses"),
    
    mongoose=require("mongoose");

const localhost="127.0.0.1";
const port=8080;
//connecting to mongodb
mongoose.connect(process.env.DATABASEURL||"mongodb://localhost:port/courses", { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false});



app.use(express.static(__dirname + "/public"));

app.use(express.static(__dirname + "/js"));
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine","ejs");

//passport config
//we tell app.js to use passport packages

app.use(require("express-session")({
    secret:"sylvester gotta code everyday bitch",
      resave:false,
      saveUninitialized:false
  }))

app.use(passport.initialize());
app.use(passport.session());



passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//array of clothes
/*var products=[{brand:"nike",size:"S",product:"t-shirt",image:"https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80",price:"123",decription:"image1"},
                 {brand:"adidas",size:"S",product:"t-shirt",image:"https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80",price:"123",decription:"image2"},
                 {brand:"puma",size:"S",product:"t-shirt",image:"https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80",price:"123",decription:"image3"},
                 {brand:"lavis",size:"S",product:"t-shirt",image:"https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80",price:"123",decription:"image4"}];

*/
/*adding the flash*/
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    
    next();
 });

//landing routes
app.get("/",function(req,res){
    res.render("landing");

});
//clothes routes
app.get("/course",function(req,res){
    Course.find({},function(err,allcourse){
        if(err){
            console.log(err);
        }else{
            res.render("course",{course:allcourse})
        }
    });
            
});

//create new product
app.post("/course",isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name=req.body.name
    var brand = req.body.brand;
    var size=req.body.size;
    var image = req.body.image;
    var description=req.body.decription;
    var price=req.body.price;
    var qty=req.body.qty;
    var newcourse = {name:name,brand: brand, size: size,image:image,decription:description,price:price,qty:qty}
  
    //create a new product and store it in db
Course.create(newcourse,function(err,createdcourse){
    if(err){
        console.log(err);
    }else{
        res.redirect("/course")
    }
});
    
});
//show a form to create new product
app.get("/course/new",isLoggedIn,function(req,res){
   res.render("newCourse") ;
}
);

//show product info routes
app.get("/course/:id",function(req,res){
    //find the product id
   
    Course.findById(req.params.id,function(err,foundCourse){
        console.log("this is the id"+ req.params.id);
        if(err){
            console.log(err);
        }else{
            //rendering the show tampletes
            res.render("show",{course:foundCourse});
        }
    });
});


// Auth Routes

//show sign up form
app.get("/register", function(req, res){
    res.render("register"); 
 });
 //handling user sign up
 app.post("/register", function(req, res){
     
     var newUser = new User({firstname: req.body.firstname,username: req.body.username,lastname: req.body.lastname,phonenumber: req.body.phonenumber,email: req.body.email});
     User.register(newUser, req.body.password, function(err, user){
         if(err){
             console.log(err);
             return res.render('register');
         }
         passport.authenticate("local")(req, res, function(){
            res.redirect("/course");
         });
     });
 });

// LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
    res.render("login"); 
 });
 //login logic
 //middleware
 app.post("/login", passport.authenticate("local", {
     successRedirect: "/course/new",
     failureRedirect: "/login"
 }) ,function(req, res){
 });
 
 app.get("/logout", function(req, res){
     req.logout();
     res.redirect("/");
 });
 
 
 function isLoggedIn(req, res, next){
     if(req.isAuthenticated()){
         return next();
     }
     res.redirect("/login");
 }




    app.listen(port,localhost,function(){
        console.log("e-learning autisms sever is listerning on port 8080");
    })