const express=require('express')
const signup_controller=require('../controller/user');
const router=express.Router();

router.post('/signup',signup_controller.create);
router.post('/signin',signup_controller.login);

module.exports=router;