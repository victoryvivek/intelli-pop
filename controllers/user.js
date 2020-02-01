const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const databasePath = path.join(__dirname, '../database/user');
const cookieConfig = require('../config/cookie');

exports.getLogin =(req,res,next)=>{
    return res.render('login',{message :''});
}

exports.getRegister =(req,res,next)=>{
    return res.render('register',{message :''});
}

exports.postRegister = (req,res,next) => {

    const username = req.body.register_username;
    const password = req.body.register_password;

    const db = new sqlite3.Database(databasePath);
    console.log(db);
    console.log(username);
    console.log(password);
    
    db.serialize(()=>{
        console.log('hi inside serilaize');
        db.run(`INSERT INTO userdatatable (username,password) VALUES ('${username}','${password}')`,err =>{
            if(err){
                console.log('Username already exists');
                return res.render('register',{message:'Username already exists'});
            }else{
                console.log('User Added');
                cookieConfig.setCookie(username+'intelli-pop',true,3);
                return res.redirect('/dashboard/'+username);
            }
        });

    });
}

exports.postLogin = (req,res,next) => {
    const username = req.body.login_username;
    const password = req.body.login_password;

    const result =cookieConfig.getCookie(username+'intelli-pop');
    if(result!="" && result == true){
        return res.redirect('/dashboard/'+username);
    }


    const db = new sqlite3.Database(databasePath);

    console.log(db);
    console.log(username);
    console.log(password);

    db.serialize(()=>{

        db.all(`SELECT * FROM userdatatable where username='${username}' and password = '${password}'`, [], (err, rows) => {
            if (err) {
              console.log('all',err);
            }
            if(rows.length==0){
                console.log('Wrong username or password');
                return res.render('login',{message:'Wrong username or password'});
            }else{
                console.log('Login Success');
                cookieConfig.setCookie(username+'intelli-pop',true,3);
                return res.redirect('/dashboard/'+username);
            }
            
          });
    });
}

exports.getDashboard = (req,res,next) => {
    const username = req.params.username;
    console.log(username);

    const result =cookieConfig.getCookie(username+'intelli-pop');
    console.log('result',result );
    
    
    if(result!='true'){
        return res.redirect('/login');
    }

    return res.render('dashboard',{username:username});
}

exports.logout = (req,res)=>{
    const username = req.params.username;
    cookieConfig.deleteCookie(username+'intelli-pop');
    res.redirect('/login');
}