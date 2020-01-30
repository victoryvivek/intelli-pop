const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const databasePath = path.join(__dirname, '../database/user');

const connectDatabase = ()=>{
    

    let db = new sqlite3.Database(databasePath,err => {
        if (err) {
            console.log('Error in Db connection',err);
        } else {
            console.log('Db connected successfully');
            
        }
    });
    return db;
}

exports.getLogin =(req,res,next)=>{
    return res.render('login')
}

exports.getRegister =(req,res,next)=>{
    return res.render('register')
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
            db.each(`SELECT * FROM userdatatable where username='${username}'`,(err,row)=>{
            console.log('inside');
            if(err){
                console.log('hi');
                db.run(`INSERT INTO userdatatable (username,password) VALUES ('${username}','${password}')`);
                console.log('User Added');
                return res.redirect('/dashboard/'+username);
            }else{
                console.log('bye');
                console.log(row);
                console.log('Username already exists');
                return res.render('/register');
            }
        });
    });
}

exports.postLogin = (req,res,next) => {
    
}

exports.getDashboard = (req,res,next) => {
    return res.render('dashboard');
}