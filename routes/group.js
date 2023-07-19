const express=require('express')
const authorization=require('../middleware/authetication');
const group_controller=require('../controller/group');
const group=require('../middleware/group');
const admin=require('../middleware/admin');
const router=express.Router();


router.post('/group',authorization.authenticate,group_controller.create_group)

router.post('/addmember',authorization.authenticate,group.authenticate,admin.authenticate,group_controller.add_member)

router.get('/group',authorization.authenticate,group_controller.get_groups)

router.get('/group_Users',authorization.authenticate,group.authenticate,group_controller.get_group_Users)

router.post('/make_Admin',authorization.authenticate,group.authenticate,admin.authenticate,group_controller.make_Admin)

router.put('/remove',authorization.authenticate,group.authenticate,admin.authenticate,group_controller.remove_member)


module.exports=router;