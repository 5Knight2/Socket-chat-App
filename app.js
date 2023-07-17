const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
const dotenv=require('dotenv').config()


const msg_route=require('./routes/chat')
const Chat=require('./models/chat')
const User=require('./models/users')
const signup_route=require('./routes/user');
const sequelize=require('./util/database')

const app=express();

app.use(cors({origin:"http://127.0.0.1:5500",
methods:"*",}))
app.use(bodyParser.json())
app.use(signup_route)
app.use(msg_route)

User.hasMany(Chat);
Chat.belongsTo(User);

sequelize
//.sync({force:true})
.sync()
.then((res)=>{
    console.log('connected');    
    app.listen(3000)})
.catch((err)=>{console.log(err)})