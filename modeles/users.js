const mongoose = require("mongoose");
const Joi =require("joi")
const passwordComplexity = require("joi-password-complexity")
const Jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({ 
    avatar:String,
    first_name:String,
    last_name:String,
    phone_number:String,
    password:String,
  
    isAdmin:{
      type:Boolean,
      default:false
    },

});

 UserSchema.methods.generateToken = async() => {
    const token = Jwt.sign(
      {_id:this._id},
      process.env.JWT_PASSWORD
    );
  return token;
}

const validate = (data) => {
  const schema = Joi.object({
    first_name:Joi.string().required().label("first_name"),
    last_name:Joi.string().required().label("last_name"),
    phone_number:Joi.string().required().label("Phone Number"),
    password:passwordComplexity().required().label("password")
  });

  return schema.validate(data);
}

const Users = mongoose.model("Users", UserSchema);

module.exports = {Users, validate};