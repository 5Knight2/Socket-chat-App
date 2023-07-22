const express=require('express')
const bodyParser=require('body-parser')
//const cors=require('cors')
const dotenv=require('dotenv').config()
const path=require('path')
const jwt=require('jsonwebtoken');


const msg_route=require('./routes/chat')
const group_route=require('./routes/group')
const Chat=require('./models/chat')
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

    socket.on('send_message',(msg,grpid)=>{
        console.log(msg)
        
            const userObj=jwt.verify(socket.handshake.auth.token,process.env.JWTsecretKey)
        
            User.findOne({where:{id:userObj.id}}).then((user)=>{if(user){
                
                group_Members.findOne({where:{userId:user.id,groupId:grpid}}).then((grpmember)=>{if(grpmember){
                    user.createChat({msg:msg.message,name:user.name,groupId:grpid});
                    socket.to(grpid).emit("receive_message",msg.message,user.name)
                  }
                else throw(new Error("You are not part of this group"))})
                .catch(err=>{console.log(err)})
                
                }else throw(new Error("Authentication failed Login again"))})
                .catch((err)=>{console.log(err)})       
        
    })
})

  
    
    })
.catch((err)=>{console.log(err)})

