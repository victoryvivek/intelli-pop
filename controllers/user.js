const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const databasePath = path.join(__dirname, '../database/user');


exports.checkTable = (req, res, next) => {
    const db = new sqlite3.Database(databasePath);
    let sql = `SELECT name FROM sqlite_master WHERE type='table' AND name='userdaatable'`;
    db.all(sql, [], (err, rows) => {
        console.log('checked')
        if (err) console.log(err);
        console.log('row', rows)
    });
};

exports.deleteTable = (req, res, next) => {
    const db = new sqlite3.Database(databasePath);
    let sql = `DROP TABLE userinfotable`;
    db.run(sql, err => {
        if (err) console.log('err', err);
        else console.log('delete table')
    })

}

exports.createTable = (req, res, next) => {
    const db = new sqlite3.Database(databasePath);
    let sql = `CREATE TABLE userinfotable(
        firstname VARCHAR NOT NULL ,
        lastname VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE PRIMARY KEY,
        phone VARCHAR NOT NULL,
        company VARCHAR NOT NULL
        )`;

    db.run(sql, err => {
        if (err) console.log(err);
        else console.log('table created');

    })
}

exports.postRegister = (req, res, next) => {
    const firstname = req.body.firstname || '';
    const lastname = req.body.lastname || '';
    const password = req.body.password || '';
    const email = req.body.email || '';
    const phone = req.body.phone || '';
    const company = req.body.company || '';

    console.log(firstname, lastname, password, email, phone, company)


    if (password == '' || firstname == '' || lastname == '' || email == '' || phone == '' || company == '') {
        return res.json({
            message: 'Fields are Empty',
            success: false
        });
    }

    const db = new sqlite3.Database(databasePath);

    db.serialize(() => {
        db.run(`INSERT INTO userinfotable (firstname,lastname,password,email,phone,company) VALUES ('${firstname}','${lastname}','${password}','${email}','${phone}','${company}')`, (err) => {
            if (err) {
                console.log(err);
                return res.json({

                    message: 'Email has been registered Previously',
                    success: false
                });
            } else {
                return res.json({
                    data: {
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        phone: phone,
                        company: company
                    },
                    success: true
                });
            }
        });
    });

    db.close();
};

const getUserByEmail = (email) => {
    const db = new sqlite3.Database(databasePath);

    return new Promise((resolve, reject) => {
        db.serialize(() => {

            db.all(`SELECT * FROM userinfotable where email='${email}'`, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                if (rows.length == 0) {
                    resolve(null);
                } else {

                    let user = {
                        firstname: rows[0].firstname,
                        lastname: rows[0].lastname,
                        email: email,
                        phone: rows[0].phone,
                        company: rows[0].company,
                        password: rows[0].password
                    }
                    resolve(user);
                }

            });
        });
    });
}

exports.postLogin = (req, res, next) => {
    const password = req.body.password || '';
    const email = req.body.email || '';

    if (password == '' || email == '') {
        return res.json({
            message: 'Fields are Empty',
            success: false
        })
    }

    getUserByEmail(email).then(user => {
        if (user == null) {
            return res.json({
                message: 'Email not registered',
                success: false
            })
        } else {
            console.log(user);
            if (user.password == password) {
                return res.json({
                    data: {
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        phone: user.phone,
                        company: user.company,
                    },
                    success: true
                })
            } else {
                return res.json({
                    message: 'Wrong Password',
                    success: false
                })
            }

        }
    }).catch(err => {
        console.log('Error in login', err);
    })
}


exports.getLogin = (req, res, next) => {
    let val = req.query.val;
    console.log('val', val);
    if (val == undefined) message = '';
    else message = val;
    console.log('message', message);
    return res.render('login', {
        message: message
    });
};
exports.getDashboard = (req, res, next) => {
    console.log('dash', req.user);
    return res.render('dashboard');
    ``;
};

exports.logout = (req, res) => {
    req.logOut();
    return res.redirect('/login');
};

exports.checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
};

exports.checkLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    return next();
};