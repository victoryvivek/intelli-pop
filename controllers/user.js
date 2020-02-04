const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const databasePath = path.join(__dirname, '../database/user');




exports.getRegister =(req,res,next)=>{
    return res.render('register',{message :''});
}

exports.postRegister = (req,res,next) => {

    const username = req.body.register_username;
    const password = req.body.register_password;

    if(password=='' || username==''){
        return res.render('register',{message:'Please fill all the fields'});
    }

    const db = new sqlite3.Database(databasePath);

    db.serialize(()=>{
        
        db.run(`INSERT INTO userdatatable (username,password) VALUES ('${username}','${password}')`,err =>{
            if(err){
                return res.render('register',{message:'Username already exists'});
            }else{
                console.log('User Added');
                return res.redirect('/login?val=User Registered');
            }
        });

    });

    db.close();
}

exports.getLogin =(req,res,next)=>{
    let val = req.query.val;
    console.log('val',val);
    if(val==undefined)message='';
    else message=val;
    console.log('message',message);
    return res.render('login',{message : message});
}
exports.getDashboard = (req,res,next) => {
    console.log('dash',req.user);
    return res.render('dashboard');``
}

exports.logout = (req,res)=>{
    req.logOut();
    return res.redirect('/login');
}

exports.checkAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/login');
}

exports.checkLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        return res.redirect('/dashboard');
    }
    return next();
}