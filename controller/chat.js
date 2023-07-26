const User=require('../models/users');
const Chat=require('../models/chat');
const { Op } = require("sequelize");


exports.sendmsg=async(req,res,next)=>{
   try{
    await req.user.createChat({msg:req.body.message,name:req.user.name,groupId:req.groupId});
    res.status(201).json({msg:"message stored in database"})
   }catch(err){
    res.status(401).json({msg:"something went wrong"})
   }
}

exports.getChat=async(req,res,next)=>{
    try{
      let id=Number( req.params.id);
      let page=Number( req.query.page);
      let condition=Op.gt
if(!id)id=0;
if(!page)page=0;
if(req.query.less){condition=Op.lt}
const count=await Chat.count({where:{id:{ [condition]: id},groupId:req.groupId} })
     
     const chat=await Chat.findAll({where:{id:{ [condition]: id},groupId:req.groupId},attributes:['id','msg'] ,
     order:[['id','DESC']],
     include: User,
     offset: (page)*10,
     limit: 10});
     res.status(201).json({chat:chat,hasnext:(count-(page+1)*10)/10})
    }catch(err){
     res.status(401).json({msg:"something went wrong"})
    }
 }