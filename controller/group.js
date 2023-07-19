const Group=require('../models/group');
const User=require('../models/users');
const GroupMember=require('../models/grpmember');

exports.create_group=async(req,res,next)=>{
    try{
     const group=await Group.create({name:req.body.fname});
     const groupmember=await GroupMember.create({groupId:group.id,isAdmin:true,userId:req.user.id});
     res.status(201).json({msg:"groupCreated",id:group.id,name:group.name})
    }catch(err){
     res.status(401).json({msg:"something went wrong"})
    }
 }

 exports.add_member=async(req,res,next)=>{
   try{
      const user=await User.findOne({where:{email:req.body.email}})
      if(user){
         const exist=await GroupMember.findOne({where:{userId:user.id,groupId:req.groupId}})
         if(exist)return res.status(401).json({msg:"User already added"})

    const group=await Group.findOne({where:{id:req.groupId}});
    if(!group)return res.status(401).json({msg:"Invalid Group"})

    const groupmember=await user.addGroup(group);
    return res.status(201).json({msg:"member Added"})}

    else res.status(401).json({msg:"user with entered email id not found"})
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

 exports.get_group_Users=async(req,res,next)=>{
   try{

      const group=await Group.findOne({where:{id:req.groupId}})

    const users=await group.getUsers({attributes:['email','name']});
   
    res.status(201).json(users)
   }catch(err){
    res.status(401).json({msg:"something went wrong"})
   }
}

exports.make_Admin=async(req,res,next)=>{
   try{
      const user=await User.findOne({where:{email:req.body.email}})
      if(!user)return res.status(401).json({msg:"user with entered email id not found"});

    const groupmember=await GroupMember.findOne({where:{userId:user.id,groupId:req.groupId}});
    groupmember.isAdmin=true;
    await groupmember.save()
    return res.status(201).json({msg:"Admin Added"})

    
   }catch(err){
    res.status(401).json({msg:"something went wrong"})
   }
}

exports.remove_member=async(req,res,next)=>{
   try{
      const user=await User.findOne({where:{email:req.body.email}})
      if(!user)return res.status(401).json({msg:"user with entered email id not found"});

    const groupmember=await GroupMember.findOne({where:{userId:user.id,groupId:req.groupId}});
  
    await groupmember.destroy()
    return res.status(201).json({msg:"User removed from group"})

    
   }catch(err){
    res.status(401).json({msg:"something went wrong"})
   }
}