const authorization=require('../middleware/authetication');
const group=require('../middleware/group');
const chat=require('../controller/chat');
const express=require('express');

const router=express.Router()

router.post('/msg',authorization.authenticate,group.authenticate,chat.sendmsg)


router.get('/msg/:id',authorization.authenticate,group.authenticate,chat.getChat)



module.exports=router;