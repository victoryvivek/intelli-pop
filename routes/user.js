const express = require('express');
const passport = require('passport');

const router = express.Router();

const userControllers = require('../controllers/user');

// router.get('/register',userControllers.checkLoggedIn ,userControllers.getRegister);
router.post('/register', userControllers.postRegister);
router.post('/login', userControllers.postLogin);

// router.post('/login', userControllers.postLogin);
// router.get('/login', userControllers.checkLoggedIn ,userControllers.getLogin);

// router.post('/login',passport.authenticate('local',{
//     failureRedirect:'/login',
//     failureFlash:true,
//     successRedirect:'/dashboard'
// }));



// router.get('/dashboard', userControllers.checkAuthenticated, userControllers.getDashboard);

// router.delete('/logout', userControllers.logout);

module.exports = router;