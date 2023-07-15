const sequelize=require('../util/database');
const Sequelize=require('sequelize');

const user=sequelize.define('user',{
id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
},
email:{
    type:Sequelize.STRING,
    allowNull:false
},
password:{
    type:Sequelize.STRING,
    allowNull:false,
},
name:{
    type:Sequelize.STRING,
    allowNull:false,
},
phone:{
    type:Sequelize.STRING,
    allowNull:false,
    unique:true
},


})
module.exports=user;
