


exports.authenticate=async(req,res,next)=>{
    try{
        
        if(req.grpmember.isAdmin==false)return res.status(401).json({msg:"You are not an Admin"})
          
        next()

    }catch(err){
        res.status(401).json({msg:"something went wrong try again later"});
    }
    }