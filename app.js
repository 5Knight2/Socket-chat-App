const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
const dotenv=require('dotenv').config()


const msg_route=require('./routes/chat')
const group_route=require('./routes/group')
const Chat=require('./models/chat')
const User=require('./models/users')
const Group=require('./models/group')
const group_Members=require('./models/grpmember')
const signup_route=require('./routes/user');
const sequelize=require('./util/database')

const app=express();

app.use(cors({origin:"http://127.0.0.1:5500",
methods:"*",}))
app.use(bodyParser.json())
app.use(signup_route)
app.use(msg_route)
app.use(group_route)

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
    app.listen(3000)})
.catch((err)=>{console.log(err)})