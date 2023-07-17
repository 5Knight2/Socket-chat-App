const User=require('../models/users');
const Chat=require('../models/chat');


exports.sendmsg=async(req,res,next)=>{
   try{
    await req.user.createChat({msg:req.body.message,name:req.user.name});
    res.status(201).json({msg:"message stored in database"})
   }catch(err){
    res.status(401).json({msg:"something went wrong"})
   }
}

exports.getChat=async(req,res,next)=>{
    try{
     const chat=await Chat.findAll({attributes:['id','msg'] ,
     include: User,
     order:[['createdAt','ASC']]});
     res.status(201).json(chat)
    }catch(err){
     res.status(401).json({msg:"something went wrong"})
    }
 }