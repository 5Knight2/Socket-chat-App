const express=require('express')
const signup_controller=require('../controller/signup');
const router=express.Router();

router.post('/signup',signup_controller.create);

module.exports=router;