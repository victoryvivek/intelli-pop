const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const databasePath = path.join(__dirname, '../database/user');

const getUser = (username,password)=>{
    const db = new sqlite3.Database(databasePath);
    let result;

    return new Promise((resolve, reject) => db.serialize(()=>{

        db.all(`SELECT * FROM userdatatable where username='${username}' and password = '${password}'`, [], (err, rows) => {
            if (err) {
              console.log('all',err);
              reject(err);
            }
            if(rows.length==0){
                console.log('Wrong username or password');
                result=null;
                resolve(null)
            }else{
                console.log('passport Login Success');
                const user = {username:username,password:password};
                resolve(user);
            }
            
          });
    }));
}

const getUserByUsername = (username)=>{
    const db = new sqlite3.Database(databasePath);

    return new Promise((resolve,reject)=>{
        db.serialize(()=>{

        db.all(`SELECT * FROM userdatatable where username='${username}'`, [], (err, rows) => {
            if (err) {
              console.log('all',err);
              reject(err);
            }
            if(rows.length==0){
                console.log('Wrong username or password');
                resolve(null);
            }else{
                console.log('Username Found');
                let user={username:username,password:rows[0].password};
                resolve(user);
            }
            
          });
        });
    });
    return result;
}

function initialize (passport){
    const authenticatUser =  (username,password,done)=>{
        let user;
        getUser(username,password).then(user=>{
            console.log('Promise result ',user);     
            

            console.log('user result',user);
        
            if(user == null ){
                return done(null,false,{message:'Invalid Username or Password'});
            }else{
                return done(null,user); 
            }
        }).catch(err=>{
            console.log('Promise err',err);
            
        });
        

    }
    passport.use(new LocalStrategy({usernameField:'login_username',passwordField:'login_password'},authenticatUser));
    passport.serializeUser((user,done) => {
        console.log('Serialize ',user);
        return done(null,user.username);
    });
    passport.deserializeUser((username,done) =>{
        console.log('deserializing');
        
        getUserByUsername(username).then(user=>{
            console.log('getUserByUsername',user);
            done(null,user);
        }).catch(err=>{
            console.log(err);
        });
        
    });
}

module.exports = initialize;