const user=require('../models/users');
const bcrypt=require('bcrypt')
const sequelize=require('../util/database')
const jwt=require('jsonwebtoken')


exports.create=async(req,res,next)=>{
   
    try{
  const result=await user.findOne({where:{email:req.body.email}})
  if(result){
    res.status(400).json({msg:"This email is already registered"})
   
  }else{
  
    bcrypt.hash(req.body.password,10,async(err,hash)=>{
        const t=await sequelize.transaction();
        try{
           await user.create({email:req.body.email,password:hash,name:req.body.fname,phone:req.body.phone},{transaction:t})
           res.status(201).json({msg:'user created successfully'})
           t.commit();
        } 
        catch(err){res.status(400).json({msg:"something went wrong"})
        t.rollback
}
        
    })
  }

    }
    catch(err){res.status(401).json({msg:"something went wrong"})}
}

exports.login=async(req,res,next)=>{
  console.log(process.env.JWTsecretKey)
try{
const result=await(user.findOne({where:{email:req.body.email}})) 
if(!result) res.status(404).json({msg:"user not found"})
 const compared=await bcrypt.compare(req.body.password,result.password)
 if(compared){
  const token=jwt.sign({id:result.id},process.env.JWTsecretKey)
  res.json({msg:"user login successful",token:token})
 }
 else res.status(401).json({msg:"user not authorized"})
}
catch(err){}
}