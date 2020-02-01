const express=require('express');
const passport = require('passport');

const router=express.Router();

const userControllers=require('../controllers/user');

router.get('/register', userControllers.getRegister);
router.post('/register',userControllers.postRegister);

router.post('/login', userControllers.postLogin);
router.get('/login', userControllers.getLogin);

router.get('/dashboard/:username',userControllers.getDashboard);

router.get('/logout/:username',userControllers.logout);

module.exports = router;