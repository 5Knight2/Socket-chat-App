const express=require('express')
const bodyParser=require('body-parser')
const signup_route=require('./routes/signup');
const sequelize=require('./util/database')

const app=express();

app.use(bodyParser.json())
app.use(signup_route)

sequelize
//.sync({force:true})
.sync()
.then((res)=>{
    console.log('connected');    
    app.listen(3000)})
.catch((err)=>{console.log(err)})