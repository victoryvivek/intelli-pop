const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const databasePath = path.join(__dirname, '../database/user');

const getUser = (email, password) => {
    const db = new sqlite3.Database(databasePath);
    let result;

    return new Promise((resolve, reject) => db.serialize(() => {

        db.all(`SELECT * FROM userinfotable where username='${email}' and password = '${password}'`, [], (err, rows) => {
            if (err) {
                console.log('all', err);
                reject(err);
            }
            if (rows.length == 0) {
                console.log('Wrong username or password');
                result = null;
                resolve(null)
            } else {
                console.log('passport Login Success');
                let user = {
                    firstname: rows[0].firstname,
                    lastname: rows[0].lastname,
                    email: email,
                    phone: rows[0].phone,
                    company: rows[0].company
                }
                resolve(user);
            }

        });
    }));
}

const getUserByEmail = (email) => {
    const db = new sqlite3.Database(databasePath);

    return new Promise((resolve, reject) => {
        db.serialize(() => {

            db.all(`SELECT * FROM userinfotable where email='${email}'`, [], (err, rows) => {
                if (err) {
                    console.log('all', err);
                    reject(err);
                }
                if (rows.length == 0) {
                    console.log('Wrong username or password');
                    resolve(null);
                } else {
                    console.log('Username Found');
                    let user = {
                        firstname: rows[0].firstname,
                        lastname: rows[0].lastname,
                        email: email,
                        phone: rows[0].phone,
                        company: rows[0].company
                    }
                    resolve(user);
                }

            });
        });
    });
    return result;
}

function initialize(passport) {
    const authenticatUser = (email, password, done) => {
        let user;
        getUser(email, password).then(user => {
            console.log('Promise result ', user);


            console.log('user result', user);

            if (user == null) {
                return done(null, false, {
                    message: 'Invalid Username or Password'
                });
            } else {
                return done(null, user);
            }
        }).catch(err => {
            console.log('Promise err', err);

        });


    }
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, authenticatUser));
    passport.serializeUser((user, done) => {
        console.log('Serialize ', user);
        return done(null, user.username);
    });
    passport.deserializeUser((username, done) => {
        console.log('deserializing');

        getUserByEmail(username).then(user => {
            console.log('getUserByUsername', user);
            done(null, user);
        }).catch(err => {
            console.log(err);
        });

    });
}

module.exports = initialize;