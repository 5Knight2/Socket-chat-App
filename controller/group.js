const Group=require('../models/group');
const GroupMember=require('../models/grpmember');

exports.create_group=async(req,res,next)=>{
    try{
     const group=await Group.create({name:req.body.fname});
     const groupmember=await req.user.addGroup(group);
     res.status(201).json({msg:"groupCreated",id:group.id,name:group.name})
    }catch(err){
     res.status(401).json({msg:"something went wrong"})
    }
 }

 exports.get_groups=async(req,res,next)=>{
    try{
     const groups=await req.user.getGroups({attributes:['id','name']});
    
     res.status(201).json(groups)
    }catch(err){
     res.status(401).json({msg:"something went wrong"})
    }
 }
