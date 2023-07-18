const authorization=require('../middleware/authetication');
const chat=require('../controller/chat');
const express=require('express');

const router=express.Router()

router.post('/msg',authorization.authenticate,chat.sendmsg)


router.get('/msg/:id',authorization.authenticate,chat.getChat)



module.exports=router;