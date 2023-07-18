const Group=require('../models/group');
const GroupMember=require('../models/grpmember');

exports.authenticate=async(req,res,next)=>{
    try{
        
        req.groupId=Number(req.query.grpid);
        const grpmember=await GroupMember.findOne({where:{userId:req.user.id,groupId:req.query.grpid}});
        if(grpmember){
        next()}
        else res.status.json({msg:"You are not part of this group"})
        
    
    
    }catch(err){
        res.status(401).json({msg:"something went wrong try again later"});
    }
    }