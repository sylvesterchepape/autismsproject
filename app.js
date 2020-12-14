if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}


var express= require("express"),
    app  =express(),
    
     async = require("async"),
   crypto = require("crypto"),
    bodyParser=require('body-parser'),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    bodyParser = require("body-parser"),
    flash = require('connect-flash'),
    passportLocalMongoose = require("passport-local-mongoose")
    User      = require("./models/user"),
    Course     = require("./models/Course"),
   nodemailer = require("nodemailer"),
   
    mongoose=require("mongoose");
    const catchAsync = require('./utils/catchAsync');
    const multer  = require('multer');
    const {storage}= require('./cloudinary');
    const upload = multer({ storage });
//server access point
const localhost="127.0.0.1";
const port=8080;
//connecting to mongodb
mongoose.connect(process.env.DATABASEURL||"mongodb://localhost:port/courses", { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false,useCreateIndex: true});



app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/js"));
app.use(express.static(__dirname + "/validate"));


app.use(bodyParser.urlencoded({extended: true}));

app.use(flash());

app.set("view engine","ejs");

//using joi to validate user







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


/*adding the flash*/
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    
    next();
 });

//landing routes
app.get("/",function(req,res){
    res.render("landing");

});
app.get("/contact",function(req,res){
  res.render("contactUs");
});
//courses routes
app.get("/course",isLoggedIn,catchAsync(async(req,res)=>{
   const course=await Course.find({})
        res.render("course",{course})
              
}));
//show a form to create new product
app.get("/course/new",isLoggedIn,function(req,res){
    res.render("newCourse") ;
 }
 );
//create new courses
app.post("/course",isLoggedIn , upload.array('image'),upload.array('video'), catchAsync(async(req, res)=>{
 
    // get data from form and add to campgrounds array
   /* var name=req.body.name
    var subject = req.body.subject;
    var image=req.body.image;
    var video = req.body.image;
    var contentNo=req.body.contentNo;
    var description=req.body.decription;*/
    const course = new Course(req.body.course);
    course.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    course.videos = req.files.map(f => ({ url: f.path, filename: f.filename }));
    console.log(course);
    await course.save();
    

  
    req.flash('success', "thank you " + ",you've successfully created new course content");
 
    res.redirect(`/course/${course._id}`);
}))



//show course info routes
app.get("/course/:id([0-9a-f]{24})",catchAsync(async(req,res)=>{
  const id = req.params.id;
    //find the course id
   const foundcourse=await Course.findById(id);

   if(!foundcourse){
       req.flash("error","cannot find this course ,try again later")
       return res.redirect('/course')
   }
   res.render('show',{course:foundcourse});
}));


app.put('/course/:id', async (req, res) => {
  const { id } = req.params;
  const course = await Course.findByIdAndUpdate(id, { ...req.body.course });
  res.redirect(`/course/${course._id}`)
});

app.delete('/course/:id', async (req, res) => {
  const { id } = req.params;
  await Course.findByIdAndDelete(id);
  res.redirect('/course');
})


// Auth Routes

//show sign up form
app.get("/register", function(req, res){
    res.render("register"); 
 });
 //handling user sign up
 app.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username,mobileNumber, password } = req.body;
        const user = new User({ email, username,mobileNumber });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'successfuly register to PILC ');
            res.redirect('/course');
        })

     } catch (e) {
         req.flash('error', e.message);
         res.redirect('register');
}
}));

// LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
    res.render("login"); 
 });
 //login logic
 //middleware
 app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/course';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})
 app.get("/logout", function(req, res){
    req.flash('success', "Take care bye!");
     req.logout();
     res.redirect("/");
 });
 
 //logger middleware to check if the user is logged in what
 function isLoggedIn(req, res, next){
     if(req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
         return next();
     }
     req.flash('error', 'You must be signed in first!');
     res.redirect("/login");
 }
 
 //forgot password routes
 app.get("/forgot",(req,res)=>{
     res.render("forgot");

 })
 
app.post('/forgot',(req, res, next)=> {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
            port:587,
          service: 'gmail', 
          auth: {
            user: process.env.GMAILUser,
            pass: process.env.GMAILPW
          },
          // === add this === //
          tls:{
            rejectUnauthorized: false
        }
    });
   
  
        var mailOptions = {
          to: user.email,
          from:'tiplerducks@gmail.com',
          subject: 'pilc Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });
  
  app.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
  app.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
            service: 'gmail', 
          auth: {
            user: process.env.GMAILUser,
            pass: process.env.GMAILPW
          },
          // === add this === //
          tls:{
            rejectUnauthorized: false
        }
    });
   
        var mailOptions = {
          to: user.email,
          from: 'tiplerducks@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, (err)=> {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], (err)=> {
        if(err){
            console.log(err)
        }
      res.redirect('/course');
    });
  });
 
 
 
 /*
 const verifySerialKey = (req, res, next)=>{
     const {code} = req.query;
          if(code == "12345"){
            next();
       }
       res.send("oops wrong route");
      }

app.get("/tearcher", verifySerialKey,(req,res)=>{
res.redirect(/course/new)
})
*/



app.use("*",(req,res)=>{
    res.status(404).send("THIS PAGE NOT FOUND");
})

    app.listen(port,localhost,function(){
        console.log("e-learning autisms sever is listerning on port 8080");
    })