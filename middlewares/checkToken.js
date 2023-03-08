const Jwt = require("jsonwebtoken")

const checkToken = (req, res, next) => {
 const headerToken =  req.headers.token;
 if(headerToken){
 	 req.token = headerToken;
   
   Jwt.verify(req.token, process.env.JWT_PASSWORD, (err, authData) => {
     if(!err) return next();
     else return res.json({sts:403, msg:"token haqiqiy emas!"})
   })


 }else{
 	 return res.json({sts:404, msg:"Token topilamadi"})
 }

}



module.exports = checkToken;