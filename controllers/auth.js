const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt    = require("jsonwebtoken");
exports.signin = function(req,res){
  const { email, password } = req.body;
  User.findOne({email:email},function(err, user){
    if(err){
      console.log(user);
      res.json({message:"not found"});
      return;
    }
    if(!user){
      console.log("no user  found");
      res.json({message:"no user found"})
      return;
    }
    if(user.active == 0){
      console.log("user need to be verified");
      res.json({message:"verify first"});
      return;
    }
    if(user.active==1){
    const value = bcrypt.compareSync(password,user.password);
      if (!value) {
        console.log("noooo");
        return;
      }
      if(value){
        // Here we can generate a cookie with token inside using jwt
        // But we can also use a verification token which we will put in headers
        username = user.username;
        console.log(username);
        jwt.sign({username},"Abhayhasnosecret",function(err, token){
          if(err){
            console.log(err);
          }
          else{
            console.log(token);
            res.cookie("session_token", token, {expire: 360000 + Date.now(), secure:false});
             // res.json({token});
        }
        });
      }
    }
  });

};
exports.signup = function(req,res){
  const {username,email,password} = req.body;
  User.findOne({email:email},function(err, user){
    if(err){
      console.log(err);
    }
    if(!user){
      const newUser = new User();
      newUser.username = username;
      newUser.email = email;
      newUser.active = 0;
      newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
      newUser.save(function(err, user){
        if(err){
          console.log(err);
        }
        else{
          console.log(user);
          // Here we can send email for verification using nodemailer or sendgrid
          res.json({message:"user signup"});
        }
      });
    }


  });
};
exports.verify = function(req, res){
  // You can verify user by credentials(like token or randomnumbers) send via email
  // link - `${process.env.CLIENT_URL}/verify?token=${token}&email=${email}`
  const email = req.query.email;
  User.findOne({email:email},function(err, user){
    if (err) {
      console.log(err);
    }
    else{
    user.active = 1;
    res.json({message:"Verified"});
  }
  });
};

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

exports.isAuthenticated = function(req,res,next){
  // auth using JWTs in a cookie
 const token = req.cookies.session_token;
  if (!token) {
   return res.status(401).json({ message: "You have to login" });
    }
  const decodedToken = jwt.verify(token, process.env.TokenJwt);
  const userId = decodedToken._id;
 User.findById(userId, function (err, result) {
  if (err) {
    res.json({
      success: false,
      message: "UserNotLoggedIn"
    });
  } else {
      res.json({
      success: true,
    });
  }
 });
  // Auth using JWTs in header

  /*const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined') {
  const bearer = bearerHeader.split(' ');
  const bearerToken = bearer[1];
  jwt.verify(bearerToken,"Abhayhasnosecret",function(err, decodedtoken){
    if(err){
      console.log(err);
    }
    else{
      req.user = decodedtoken;
      next();
    }
  });
  }
  else{
  // Forbidden
  res.sendStatus(403);
} */
};
exports.logout = function (req, res) {
  res.clearCookie("session_token");
  res.json({
    success: true,
    message: "Logged out Succesfully!",
  });
};
