const express = require("express");
const router  = express.Router();
const passport = require("passport");
const {signup,signin,verify,isAuthenticated} = require("../controllers/auth");

router.post("/signin",signin);
router.post('/signup',signup);
router.get('/verify',verify);   // route should be like /verify?email=""&token=""  but u need to pass only email here
router.get('/',function(req, res){
  res.render("index");
});
router.get('/signin',function(req, res){
  res.render("signin");
});
router.get('/signup',function(req, res){
  res.render("signup");
});
router.get('/secret',isAuthenticated,function(req, res){
  res.render("secret");
});

module.exports = router ;
