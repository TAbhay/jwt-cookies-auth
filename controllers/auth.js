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
      }
      if(value){
        // Here we can generate a cookie with token inside using jwt
        // But we are using a verification token which we will put in headers
        username = user.username;
        console.log(username);
        jwt.sign({username},"Abhayhasnosecret",function(err, token){
          if(err){
            console.log(err);
          }
          else{
            console.log(token);
          res.json({token});
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
    //if(user.active == 0){
    //  console.log("user exist but not verified");
    //}
    //if(user.active==1){
    //  console.log("user exists.. please signin");
  //  }

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
  const bearerHeader = req.headers['authorization'];
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
}
};
