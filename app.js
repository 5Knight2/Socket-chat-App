const express=require('express')
const bodyParser=require('body-parser')
//const cors=require('cors')
const dotenv=require('dotenv').config()
const path=require('path')
const jwt=require('jsonwebtoken');
const aws=require('aws-sdk')
var CronJob = require('cron').CronJob;



const msg_route=require('./routes/chat')
const group_route=require('./routes/group')
const Chat=require('./models/chat')
const ArchivedChat=require('./models/archivedchat')
const User=require('./models/users')
const Group=require('./models/group')
const group_Members=require('./models/grpmember')
const signup_route=require('./routes/user');
const sequelize=require('./util/database')

const app=express();
const server=require('http').createServer(app)
const io = require("socket.io")(server,{cors:{origin:"http://localhost:3000"}})
//app.use(cors())
//app.use(cors({origin:"http://127.0.0.1:5500",methods:"*",}))


var job = new CronJob(
    '1 0 * * * *',
   async function() {
    const t=await sequelize.transaction();
        try {
            
            const rows = await Chat.findAll({raw:true});
            await ArchivedChat.bulkCreate(rows,{validate:false},{transaction:t});
            await Chat.destroy({ where: {} },{transaction:t});
            t.commit;
            console.log('Rows Transferred');
          } catch (error) {
            console.error('Corn function failed', error);
            t.rollback;
          }
    },
    null,
    true
);



app.use(bodyParser.json())
app.use(signup_route)
app.use(msg_route)
app.use(group_route)
app.use((req,res)=>{
    res.sendFile(path.join(__dirname,'public/',req.url))
})

User.hasMany(Chat);
Chat.belongsTo(User);
Group.hasMany(Chat);

User.hasMany(ArchivedChat);
ArchivedChat.belongsTo(User);
Group.hasMany(ArchivedChat);

User.belongsToMany(Group,{through:group_Members})
Group.belongsToMany(User,{through:group_Members})



sequelize
//.sync({force:true})
.sync()
.then((res)=>{
    console.log('connected');   
   // var server= app.listen(3000)  

   server.listen(3000,()=>{console.log('running.....')})
   io.on('connection',(socket)=>{
    console.log(socket.id)

    socket.on('send_message',async (msg,grpid)=>{
try{
            const userObj=jwt.verify(socket.handshake.auth.token,process.env.JWTsecretKey)
        
            const user=await User.findOne({where:{id:userObj.id}})
            if(user){
                
                const grpmember=await group_Members.findOne({where:{userId:user.id,groupId:grpid}})
                
                    if(grpmember){
                        if(msg.data=='text'){
                    await user.createChat({msg:msg.message,name:user.name,groupId:grpid});
                    io.to(grpid).emit("receive_message",msg.message,user.name)}
                    else{
                        const FILE_NAME=user.email+new Date()+'.txt';

                        const URL= await update(msg.message,FILE_NAME,msg.data);
                        await user.createChat({msg:URL,name:user.name,groupId:grpid});
                    io.to(grpid).emit("receive_message",URL,user.name)
                    }
                  }
                else socket.emit('error_response', "You are not part of this group")

                }else socket.emit('error_response', "Authentication failed Login again")
                       
            }catch(err){console.log(err)}
    })
    socket.on('join_room',async(grpid,email)=>{
        try{
        const userObj=jwt.verify(socket.handshake.auth.token,process.env.JWTsecretKey)
    
        const user=await User.findOne({where:{id:userObj.id}})
        if(user){
            
            const grpmember= await group_Members.findOne({where:{userId:user.id,groupId:grpid}})
                if(grpmember){
                socket.join(grpid)
              }
            else socket.emit('error_response', "You are not part of this group")
            }else socket.emit('error_response', "Authentication failed Login again")
             }
            catch(err){console.log(err)}      
    
})
})

  
    
    })
.catch((err)=>{console.log(err)})



async function update(data,FILE_NAME,type){
    const KEY=process.env.AWS_KEY;
    const SECRET=process.env.AWS_SECRET;
    const BUCKET_NAME=process.env.AWS_BUCKET_NAME;

    let S3Bucket=new aws.S3({
        accessKeyId:KEY,
        secretAccessKey:SECRET,
        Bucket:BUCKET_NAME
    })

    var params={
        Bucket:BUCKET_NAME,
        Key:FILE_NAME,
        Body:data,
        ACL:'public-read',
        ContentType:type
    }

    return new Promise((resolve, reject)=>{
     S3Bucket.upload(params,(err,response)=>{
        
        if(err){
         reject(err)}
        else{
             resolve(response.Location);
        }})
    })
    

} 