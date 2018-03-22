const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/user-model');

const authRoutes = express.Router();

authRoutes.post('/api/signup', (req, res, next)=>{
      if(!req.body.signUpUsername || !req.body.signUpPassword || !req.body.signUpFirstName || !req.body.signUpLastName || !req.body.signUpRole){
        res.status(400).json({message: "Please Fill In All Fields"});
        return;
      }
      
     User.findOne({ username: req.body.signUpUsername }, (err, userFromDb)=>{
          // If error finding username, return error
          if(err){
            res.status(500).json({message: "Username check went wrong"});
            return;
          }

          // If username already exists, return error
          if(userFromDb){
              res.status(400).json({message: "Username taken. Choose another one."});
              return;
          }
          
          //If User Signing Up is Doctor
          if (req.body.signUpRole === "Doctor"){
            
            //Validate Address Field
            // if(!req.body.signUpaddress){
            //   res.status(400).json({message: "Please Fill In All Fields"});
            //   return
            // }
          
            //Hash Password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.signUpPassword, salt)

            //Define User
            const theUser = new User({
              username: req.body.signUpUsername, 
              encryptedPassword: hashedPassword,
              firstName: req.body.signUpFirstName,
              lastName: req.body.signUpLastName, 
              address: req.body.signUpAddress,
              city: req.body.signUpCity,
              state: req.body.signUpState,
              zip: req.body.signUpZip,
              role: req.body.signUpRole,
          });
        
          //Save The User To Database
          theUser.save((err)=> {
            if(err){
              res.status(500).json({message: "Error Saving User."});
              return;
            }

          // Log In User Automatically After Sign Up
          req.login(theUser, (err)=>{
            if(err){
              res.status(500).json({message: "Login Error"});
              return;
            }

          //Clear encryptedPassword Before Sending
          // (From Request Object Only, Not Database) 
          theUser.encryptedPassword = undefined;

          // Send User's Info to Frontend 
          res.status(200).json(theUser);
        });
        console.log(req.isAuthenticated())
      });
    };
        //If User Signing Up is Patient
        if (req.body.signUpRole === "Patient"){
        //Find Patient in Database
          User.find({"firstName": req.body.signUpFirstName, "lastName": req.body.signUpLastName}, (err, user)  => {
            if (err){
              return res.status(400).json({message: 'Error Finding User'})
            }
            console.log(user)
            //If Patient Not In Database, Deny SignUp
            if (!user){
            res.status(400).json({message: "Unauthorized"})
            return;
            // Check if Patient Already Has A Username and Password. If True Deny Signup.
          } else if (user.username) {
            res.status(400).json({message: "Account Already Exists"})
            return;
          } else {	
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.signUpPassword, salt)
          
            //Define User
            const updates = {
            username: req.body.signUpUsername, 
            encryptedPassword: hashedPassword,
            };
           
        // Save The User To Database
          User.findOneAndUpdate({"firstName": req.body.signUpFirstName, "lastName": req.body.signUpLastName}, updates, (err, clientSignUp)=> {
            if(err){
              res.json(err);
            return;
            }
            // Log In User Automatically After Sign Up
            req.login(clientSignUp, (err)=>{
              if(err){
                res.status(500).json({message: "Login Error"});
              return;
              };
            })

         //Clear encryptedPassword Before Sending
        // (From Request Object Only, Not Database) 
          // clientSignUp.encryptedPassword = undefined;
          
          res.status(200).json({message: 'Username and Password Added to Client!'})
          });
        }
      });
    }
  });
});

  authRoutes.post('/api/login', (req, res, next) =>{
    const authenticateFunction = passport.authenticate('local', (err, theUser, failureDetails)=>{

      if(err){
        res.status(500).json({message: 'Unknown Error During Log In'})
      }
      if(!theUser){
        //Error Message Comes From Local Strategy and Passed Through Failure Details
        res.status(401).json(failureDetails);
        return;
      }
      //Login Successful, Save User to Session 
      req.login(theUser, (err) =>{
        if(err){
          res.status(500).json({message:"Error Saving the Session"});
          return;
        }

      //Clear encryptedPassword Before Sending
      // (From Request Object Only, Not Database) 
      theUser.encryptedPassword = undefined;

      //Send User Info to Front End
      res.status(200).json(theUser);
    
    });
  });
  authenticateFunction(req, res, next);
});

//Logout Route
authRoutes.post("/api/logout", (req, res, next)=>{
  //From Passport
  req.logout();
  res.status(200).json({ message: "Log Out Success!"})
});

//Check If Logged In Route
authRoutes.get('/api/checklogin', (req, res, next)=>{
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
      console.log("user from check: ", req.user)
      return;
    }
    res.status(401).json({ message: 'Unauthorized Access'});
});

//Private Route
function checkPrivate(req, res, next) {
  if (!req.isAuthenticated()) {
    res.status(403).json({ message: 'Unauthorized Access'});
    return;
  }

  next();
}

authRoutes.get('/api/private', checkPrivate, (req, res, next)=>{
    res.json({message: 'You Have Access!'})
});

module.exports = authRoutes;