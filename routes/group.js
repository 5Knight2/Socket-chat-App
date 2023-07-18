const express=require('express')
const authorization=require('../middleware/authetication');
const group_controller=require('../controller/group');
const router=express.Router();


router.post('/group',authorization.authenticate,group_controller.create_group)

router.get('/group',authorization.authenticate,group_controller.get_groups)


module.exports=router;