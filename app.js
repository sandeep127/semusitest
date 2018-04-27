const express=require('express');
const app=express();
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/testuser');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); 
var session = require('express-session');
var cookieParser = require('cookie-parser');
console.log(__dirname);
var User=require(__dirname+'/models/user.js');
var Info=require(__dirname+'/models/info.js');
app.use(session({secret: 'your secret', saveUninitialized: true, resave: false}));
var urlencodedParser=bodyParser.urlencoded({ extended: true });
//console.log(urlencodedParser)
app.set('view engine', 'ejs');
//app.use(express.static(__dirname + '/views'));
app.set('views','./views');

app.get('/',function(req,res){
  res.redirect('/signup');
})

app.get('/signup',function(req,res){
	if(!req.session.userId)
    res.render('signup');
  else
    res.redirect('/profile');
})
app.post('/signup',urlencodedParser,function(req,res,next){
	//console.log(req.session);
   //console.log(userData);
  var userData={email: req.body.email, password: req.body.password };
  User.create(userData, function (error, user) {
    if (error) {
      return next(error);
    } else {
        req.session.userId = user.email;
        console.log(req.session.userId);
        return res.redirect('/profile');
    }
  });
});
app.get('/adduser',function(req,res){
  if(req.session.userId){
    res.render('adduser',{
      data: req.session.userId,
    });
  }
  else{
    res.redirect('/signup');
  }
})

app.get('/logout',function (req,res){
  req.session.destroy();
  return res.redirect('/signup');
});
 // var display= function(x){
 //  User.find(x){
    
 //  }
 // }
app.get('/profile',function(req,res){
  if(req.session.userId)
  {
    Info.find({reference:req.session.userId}, function(err,docs){
    //console.log(docs);
    res.render('profile',{
      data: req.session.userId,
      doc: docs,
      });
    })
  }
  else
    res.redirect('/signup');
})

app.post('/login',urlencodedParser,function(req,res,next){
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user.email;
        return res.redirect('/profile');
      }
    })
  }
  else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

app.post('/adduser',urlencodedParser,function(req,res,next){
  var x=req.body;
  //console.log(x);
  if(x.nam && x.state && x.phone && x.email && x.reference)
  {
    var infoData={name: x.nam, email: x.email, state: x.state, phone:x.phone, reference: x.reference};
    Info.create(infoData,function (error , data){
      if(error)
        return next(error);
      else
        res.redirect('/profile');
    })
  }
else
  //console.log(req.body);
  res.send("Enter correct field");
});

app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


app.listen("3000");
