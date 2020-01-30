const express=require('express');

const router=express.Router();

const userControllers=require('../controllers/user');

router.get('/register', userControllers.getRegister);
router.post('/register',userControllers.postRegister);

router.post('/login', userControllers.postLogin);
router.get('/login', userControllers.getLogin);

router.get('/dashboard/:username',userControllers.getDashboard);

module.exports = router;