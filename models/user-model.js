const mongoose = require('mongoose');
const email = require('mongoose-type-email');
const Schema = mongoose.Schema; 


const UserSchema = new Schema({
  username: {
      type: String,
      // required: true
    }, 
  encryptedPassword: {
      type: String,
      // required: true
    },
    firstName: {
      type: String,
      required: true
    }, 
    lastName: {
      type: String,
      required: true
    },
    address:{
      type: String,
      required: true
    },
    city: {
      type: String, 
      required: true
    },
    state: {
      type: String,
      maxlength: 2,
      uppercase: true,
      required: true
    },
    zip: {
      type: Number,
      required: true,
      // min: 1001,
      // max: 99999
    },
    // email: {
    //   type: mongoose.SchemaTypes.Email, 
    //   required: [true, 'Invalid Email Address']
    // },
    // phone:{
    //   type: String,
    //   required: true
    // },
    //Patient Fields
    gender:{
      type: String,
      enum: ["M", "F"],
    },
    insurance_co:{
      type: String
    },
    image: {
      type: String
    },
    //Role Selection
    role: {
      type: String, 
      enum: ['Doctor', 'Patient'],
      default: ['Patient'],
      required: true
    }
  },
  {
      timestamps: true
  }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;