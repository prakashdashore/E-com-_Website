var express = require('express');
var router = express.Router();
var passport = require('passport');
const multer = require("multer");
const { findOne, findByIdAndUpdate, findOneAndUpdate } = require('./users');
const LocalStrategy = require("passport-local").Strategy;
var userModale = require('./users');
var productModale = require('./products');
passport.use(new LocalStrategy(userModale.authenticate()));

const products = require('./products');
const { resolveInclude } = require('ejs');
// const upload = multer({ storage: mul.storage });
// var userImages = require('../config/multer');
var config = require('../config/multer');
const userDets = multer({storage:config.userimages });
const productDets = multer({storage:config.productimages });


/* GET home page. */
router.get('/verify' , isLoggedIn, async function(req,res){
  var user = await userModale.findOne({username:req.session.passport.user})
  let dets = user.gstin.length
  res.render('verify',{user,dets});
})

router.post('/verified' , isLoggedIn, async function(req,res){
  var data = {
    name: req.body.name,
    username: req.body.username,
    email:req.body.email,
    contect:req.body.contect,
    gstin:req.body.gstin,
    address:req.body.address,    
  }
  var loggedInUser = await userModale.findOneAndUpdate({username:req.session.passport.user},data)
  res.redirect('/profile')
 
})

router.get('/', function(req, res, next) {
  res.render('index');
});
router.post('/productcreate',productDets.array('productpic',3),async function(req,res){
  var user = await userModale.findOne({username:req.session.passport.user});
  if(user.isseller){
    var data = {
      userid:user._id,
      productname:req.body.productname,
      price:req.body.price,
      productpic:req.files.map(e => e.filename),
      disc:req.body.dis,
    };
    var createdProduct = await productModale.create(data);
    user.products.push(createdProduct._id);
    await user.save();

  } 
  else{

    res.send('your are not vendor');
  }
  res.redirect('profile');
})
router.get('/edit/product/:id', async function(req,res){
  var product = await productModale.findOne({_id:req.params.id});
  req.send('show a form to edit product');

});
router.post('/deletproduct/:id' , async function( req,res){
  let product = await productModale.findOne({_id:req.params.id}).populate('userid');
  let user = await userModale.findOne({username:req.session.passport.user});
  await productModale.findByIdAndDelete({_id:req.params.id})
  await products.splice(user.products.indexOf(product._id),1);
  await user.save();   
  // if (product.userid.username===user.username){
    
  // }else{
  //   res.send('you are not veryfied user on memezon ')
  // }
  res.redirect('/allproducts');

});
router.get('/wishlist/product/:id',async function(req,res){
  let product = await productModale.findOne({id:req.params._id});
  let user = await userModale.findOne({username:req.session.passport.user});
  if(user.wishlist.indexOf(req.params.id)===-1){
    await user.wishlist.push(req.params.id);
    await user.save();
  }
  res.redirect('/mart');
  
});
router.get('/remove/:id',async function(req,res){
  let user = await userModale.findOne({username:req.session.passport.user})
  var el = user.wishlist.indexOf(req.params.id)
  await user.wishlist.splice(el,1);
  await user.save();
  res.redirect('/userwishlist');
 
});

router.get('/userwishlist',async function(req,res){
  let user = await userModale.findOne({username:req.session.passport.user}).populate("wishlist");
  res.render("wishlist",{user});
});



router.get("/login", isRedirected,  function (req, res) {
  res.render('login')

});
router.get("/register", isRedirected,  function (req, res) {
  res.render('register')

});

router.get("/mart", async function (req, res) {
  var allprods= await productModale.find().populate('userid');
  res.render('mart',{allprods})
  // console.log(allprods)

});

router.get("/profilephoto", async function (req, res) {
  res.render('profilephoto');
});
router.post('/upload',userDets.single('userphoto'), async function(req,res){
  user = await userModale.findOne({username:req.session.passport.user})
  user.userpic = req.file.filename;
  await user.save()
  res.redirect('/profile')
});








// User Registration Routes_________________________________________________________________
router.post("/register",function (req, res) {
  var userdets = new userModale({
    name: req.body.name,
    username: req.body.username,
    email:req.body.email,
    contect:req.body.contect,
    isseller:req.body.isseller
  });
  userModale.register(userdets, req.body.password).then(function (u) {
   
    passport.authenticate("local")(req, res, function () {
      res.redirect('/login');
      
      
    });
  });
});
router.get("/profile", isLoggedIn,async function (req, res, next) {
  let user = await userModale.findOne({username:req.session.passport.user}).populate('products');
  // console.log(user);
  let verified = true;
  let ans = user.toJSON();
  var ignore = ['products','wishlist'];
  for(let us in ans){
    if(ignore.indexOf(us) === -1 && ans[us].length===0) verified = false; 
    // console.log(verified)

  }
  res.render('profile',{user,verified});
});
router.get("/read", async function (req, res) {
  // res.send('logged in ');
  var user =await userModale.find()
  res.json(user);
});
router.get("/find", async function (req, res) {
  // res.send('logged in ');
  var allprods =await productModale.find();

  res.send(allprods)
});
router.get("/allproducts", async function (req, res) {
  // res.send('logged in ');
  var loggedInUser = await userModale.findOne({username:req.session.passport.user}).populate('products');
  var allprods =await productModale.find();
  // console.log(loggedInUser)
  // console.log(allprods)
  res.render("allproducts",{allprods,loggedInUser})
  // res.send(allprods);
});
router.post("/login",passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  function (req, res, next) {}
  
);
router.get("/logout", function(req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/mart");
  });
});
// Authenticate user Login
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
function isRedirected(req,res,next){
  if(req.isAuthenticated()){
    res.redirect("/profile");   
  }else{
    return next();
  }
 
}
module.exports = router;

