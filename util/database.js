const Sequelize=require('sequelize')

const DB=new Sequelize('chat_app','root','Password@123',{
    dialect:'mysql', 
    host:'localhost'
})

module.exports=DB;