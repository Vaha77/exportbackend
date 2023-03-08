const router = require("express").Router();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const {Users, validate} = require("../modeles/users"); 
const upload = require("../middlewares/upload")
const checkToken = require("../middlewares/checkToken");
const JWT = require("jsonwebtoken");

router.get("/user/:user_id", checkToken, async(req,res)=> {  
   const user = await Users.findById(req.params.user_id);
   return res.json({sts:200, msg:"success", user})

})


router.post("/user-add", upload.single("image"), async(req,res) => {
   const {error} = validate(req.body);
   if(error) return res.json({msg:error.details[0].message});
   const findUser = await Users.findOne({phone_number:req.body.phone_number})
   if(findUser){
    if(req.file) {
     let filename = req.file.filename;
     let filePath = path.join(__dirname, `../uploads/images/${filename}`);
     await fs.unlink(filePath,(err) => err ? console.log(err):null);
    }
     return res.json({msg:`Bunday ${req.body.first_name} ro'yxatga olingan!`});
   } 

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const user = await new Users({
  ...req.body,
   password:hashPassword,
   avatar:`${req.protocol}://${req.hostname}:${process.env.PORT}/${req.file.destination}/${req.file.filename}`
  }).save();

  return res.status(201).json({msg:"succes new User saved", sts:201, token:JWT.sign({_id:user._id}, process.env.JWT_PASSWORD), user});  

});



router.post("/user-auth", async(req,res) => {
  // const {error} = validate(req.body);
  // if(error) return res.json({msg:error.details[0].message});
   let user = await Users.findOne({phone_number:req.body.phone_number});
  if(!user) return res.json({msg:`Siz Ro'yxatdan o'tmagansiz `});  
 const hashPassword = await bcrypt.compare(req.body.password, user.password);
   if(!hashPassword) return res.json({msg:`Password Xato!`});

return res.json({msg:"Muvaffaqiyatli tizimga kirdingiz", sts:200, token:JWT.sign({_id:user._id}, process.env.JWT_PASSWORD), user});  

});




router.delete("/:id", async(req,res) => {
 const isObjectId = mongoose.isObjectIdOrHexString(req.params.id);
 if(!isObjectId) return res.json({msg:"error id not found!"})
  const deleted = await Users.findByIdAndRemove(req.params.id);
  if(!deleted) return res.json({msg:"error id not found!"})
  const filename =  deleted.avatar.split("/").pop();
  await fs.unlink(path.join(__dirname, `../uploads/images/${filename}`), (err) => err ? console.log(err):null);
  return res.json({status:200, msg:"success deleted!"})
})



module.exports = router;
