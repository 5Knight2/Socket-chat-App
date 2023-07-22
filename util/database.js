const Sequelize=require('sequelize')

const DB=new Sequelize(process.env.SQL_PROJECT,process.env.SQL_USER,process.env.SQL_PASSWORD,{
    dialect:'mysql', 
    host:process.env.SQL_HOST
})

module.exports=DB;