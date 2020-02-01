const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const databasePath = path.join(__dirname, '../database/user');

const getUser = async(username,password)=>{
    const db = new sqlite3.Database(databasePath);

    // console.log(db);
    // console.log(username);
    // console.log(password);
    let result;

    db.serialize(()=>{

        db.all(`SELECT * FROM userdatatable where username='${username}' and password = '${password}'`, [], (err, rows) => {
            if (err) {
              console.log('all',err);
              result=null;
            }
            if(rows.length==0){
                console.log('Wrong username or password');
                result=null;
            }else{
                console.log('passport Login Success');
                const user = {username:username,password:password};
                // console.log('user func',user);
                result = user;
            }
            
          });
    });
    console.log(result);
    
    return result;
}

const getUserByUsername = (username)=>{
    const db = new sqlite3.Database(databasePath);

    // console.log(db);
    // console.log(username);
    // console.log(password);

    db.serialize(()=>{

        db.all(`SELECT * FROM userdatatable where username='${username}'`, [], (err, rows) => {
            if (err) {
              console.log('all',err);
              return null;
            }
            if(rows.length==0){
                console.log('Wrong username or password');
                return null;
            }else{
                console.log('Username Found');
                return {username:username,password:password};
            }
            
          });
    });
    return result;
}

function initialize (passport){
    const authenticatUser =  (username,password,done)=>{
        let user =  getUser(username,password);
        console.log('user',user);
        
        if(user == null ){
            return done(null,false,{message:'Invalid Username or Password'});
        }else{
            return done(null,user); 
        }

    }
    passport.use(new LocalStrategy({usernameField:'login_username',passwordField:'login_password'},authenticatUser));
    passport.serializeUser((user,done) => {
        return done(null,user.username);
    });
    passport.deserializeUser((username,done) =>{
        const user = getUserByUsername(username);
        done(null,user);
    });
}

module.exports = initialize;