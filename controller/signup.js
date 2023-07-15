const user=require('../models/users');
const bcrypt=require('bcrypt')
const sequelize=require('../util/database')

exports.create=async(req,res,next)=>{
   
    try{
  const result=await user.findOne({where:{phone:req.body.phone}})
  if(result){
    res.status(400).json({msg:"This phone number is already registered"})
   
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