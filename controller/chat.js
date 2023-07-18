const User=require('../models/users');
const Chat=require('../models/chat');
const { Op } = require("sequelize");


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
      let id=Number( req.params.id);
if(!id)id=0;
     const chat=await Chat.findAll({where:{id:{ [Op.gte]: id}},attributes:['id','msg'] ,
     include: User});
     res.status(201).json(chat)
    }catch(err){
     res.status(401).json({msg:"something went wrong"})
    }
 }