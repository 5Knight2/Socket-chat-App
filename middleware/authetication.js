const User=require('../models/users');
const jwt=require('jsonwebtoken');


exports.authenticate=async(req,res,next)=>{
try{
    const userObj=jwt.verify(req.headers.authorization,process.env.JWTsecretKey)

    const user=await User.findOne({where:{id:userObj.id}});
    if(user){
    req.user=user;
    next()}
    else res.status.json({msg:"Authentication failed Login again"})
    


}catch(err){
    res.status(401).json({msg:"something went wrong try again later"});
}
}
