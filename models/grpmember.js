const sequelize=require('../util/database');
const Sequelize=require('sequelize');

const grpmember=sequelize.define('group_Members',{
id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
},
isAdmin:{type:Sequelize.BOOLEAN,
defaultValue:false}
})
module.exports=grpmember;
