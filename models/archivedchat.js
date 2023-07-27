const sequelize=require('../util/database');
const Sequelize=require('sequelize');

const chat=sequelize.define('archivedchat',{
id:{
    type:Sequelize.INTEGER,
    allowNull:false,
    primaryKey:true
},
msg:{
    type:Sequelize.STRING,
    allowNull:false,
},
createdAt:{
    type:Sequelize.DATE,
    allowNull:false,
},
updatedAt:{
    type:Sequelize.DATE,
    allowNull:false,
}


})
module.exports=chat;
