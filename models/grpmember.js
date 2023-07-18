const sequelize=require('../util/database');
const Sequelize=require('sequelize');

const grpmember=sequelize.define('group_Members',{
id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
}

})
module.exports=grpmember;
