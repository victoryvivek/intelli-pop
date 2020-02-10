const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const databasePath = path.join(__dirname, '../database/template');
const uuidv5 = require('uuid/v5');
const uuidv4 = require('uuid/v4');
const fs = require('fs');


exports.table = () => {
    const db = new sqlite3.Database(databasePath);
    // console.log(db);

    // db.run(`DROP TABLE assign_layout`, err => {
    //     if (err) {
    //         console.log('err in table', err);

    //     } else {
    //         console.log('done');

    //     }
    // });
    let sql = `CREATE TABLE templateinfo(date DATE PRIMARY KEY NOT NULL, username VARCHAR NOT NULL, market VARCHAR NOT NULL,template VARCHAR NOT NULL)`;
    let sql1 = `CREATE TABLE uuidtable (timestamp VARCHAR NOT NULL,email VARCHAR NOT NULL, uuid VARCHAR NOT NULL,url VARCHAR NOT NULL,PRIMARY KEY(email,uuid))`;
    let sql2 = `CREATE TABLE assign_layout (startdate VARCHAR NOT NULL,enddate VARCHAR NOT NULL,email VARCHAR NOT NULL,url VARCHAR NOT NULL,layout_id VARCHAR NOT NULL,active VARCHAR NOT NULL,PRIMARY KEY(email,url))`;
    let sql3 = `CREATE TABLE layoutinfo (layout_id VARCHAR NOT NULL,name VARCHAR NOT NULL,title VARCHAR NOT NULL,content VARCHAR NOT NULL,email VARCHAR NOT NULL,url VARCHAR NOT NULL,startdate VARCHAR NOT NULL,enddate VARCHAR NOT NULL)`;


    let sql4 = `CREATE TABLE assign_layout (startdate VARCHAR NOT NULL,enddate VARCHAR NOT NULL,email VARCHAR NOT NULL,url VARCHAR NOT NULL,uuid VARCHAR,layout_id VARCHAR NOT NULL,active VARCHAR NOT NULL,title VARCHAR NOT NULL,content VARCHAR NOT NULL,imageurl VARCHAR,PRIMARY KEY(email,url,startdate,enddate))`;


    db.run(sql4, err => {
        if (err) {
            console.log('err in table', err);
        } else {
            console.log('done');

        }
    });
}

const generateUuid = (url) => {
    return uuidv4();
}

const setDataUuidtable = (email, url, timestamp, uuid) => {
    const db = new sqlite3.Database(databasePath);
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`INSERT INTO uuidtable(timestamp,email,uuid,url) VALUES ('${timestamp}','${email}','${uuid}','${url}')`, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        data: {
                            uuid: uuid
                        },

                        success: true
                    })
                }
            })
        })
    })
}

exports.checkUuidtable = (req, res, next) => {
    const email = req.body.email;
    const url = req.body.url;
    const timestamp = new Date()
    const uuid = generateUuid(url);

    const db = new sqlite3.Database(databasePath);

    db.serialize(() => {
        db.all(`SELECT * FROM uuidtable WHERE email='${email}' and url='${url}'`, (err, rows) => {
            if (err) {
                console.log('check', err);
                return res.json({
                    error: err,
                    success: false
                })
            } else if (rows.length == 0) {

                setDataUuidtable(email, url, timestamp, uuid).then(result => {
                    return res.json(result);
                }).catch(err => {

                    return res.json({
                        error: err,
                        success: false
                    })
                })

            } else {
                return res.json({
                    message: 'Fields already exist',
                    success: false
                })
            }
        })
    })
}

exports.getUuidTableData = (req, res, next) => {
    const email = req.params.email;

    const db = new sqlite3.Database(databasePath);

    db.serialize(() => {
        db.all(`SELECT * FROM uuidtable WHERE email='${email}'`, (err, rows) => {
            if (err) {
                console.log('check', err);
                return res.json({
                    error: err,
                    success: false
                })
            } else if (rows.length == 0) {
                return res.json({
                    success: false,
                    message: 'No data corresponding to this email'
                })
            } else {
                let data = [];
                rows.forEach(row => {
                    data.push({
                        uuid: row.uuid,
                        created_date: row.timestamp,
                        url: row.url
                    })
                })
                return res.json({
                    data: data,
                    success: true
                })
            }
        })
    })
}

exports.deleteRowInUuidTable = (req, res, next) => {
    const email = req.params.email;
    const uuid = req.params.uuid;

    console.log(email, uuid)

    const db = new sqlite3.Database(databasePath);

    let sql = `DELETE FROM uuidtable where email='${email}' and uuid='${uuid}'`;
    db.serialize(() => {
        db.run(`DELETE FROM uuidtable where email='${email}' and uuid='${uuid}'`, err => {
            if (err) {
                console.log(err);

                return res.json({
                    success: false,
                    error: err
                })
            }
            return res.json({
                success: true,
                message: 'Email deleted'
            })
        });
    })
}

exports.setDataAssignLayoutTable = (req, res, next) => {
    const startdate = req.body.startdate;
    const enddate = req.body.enddate;
    const email = req.body.email;
    const url = req.body.url;
    const layout_id = req.body.layout_id;
    const active = req.body.active || "true";
    const content = req.body.content || '';
    const title = req.body.title || '';
    const uuid = req.body.uuid;
    const imageurl = req.body.imageurl || '';

    const db = new sqlite3.Database(databasePath);

    let sql = `INSERT INTO assign_layout(startdate,enddate,email,url,layout_id,active,content,title,uuid,imageurl) values ('${startdate}','${enddate}','${email}','${url}','${layout_id}','${active}','${content}','${title}','${uuid}','${imageurl}')`;
    db.serialize(() => {
        db.run(sql, err => {
            if (err) {
                return res.json({
                    error: err,
                    success: false
                })
            } else {
                return res.json({
                    success: true,
                    message: 'Data Added'
                })
            }
        })
    })
}

exports.editDataAssignLayoutTable = (req, res, next) => {
    const previousStartDate = req.body.previousStartDate;
    const previousEndDate = req.body.previousEndDate;
    const startdate = req.body.startdate;
    const enddate = req.body.enddate;
    const email = req.body.email;
    const url = req.body.url;
    const layout_id = req.body.layout_id;
    const active = req.body.active;
    const content = req.body.content || '';
    const title = req.body.title || '';
    const uuid = req.body.uuid;
    const imageurl = req.body.imageurl || '';

    const db = new sqlite3.Database(databasePath);

    console.log(email, url, previousStartDate, previousEndDate);

    let sql = `DELETE FROM assign_layout where email='${email}' and url='${url}' and startdate='${previousStartDate}' and enddate='${previousEndDate}'`;
    let sql1 = `INSERT INTO assign_layout(startdate,enddate,email,url,layout_id,active,content,title,uuid,imageurl) values ('${startdate}','${enddate}','${email}','${url}','${layout_id}','${active}','${content}','${title}','${uuid}','${imageurl}')`;
    db.serialize(() => {
        db.run(sql, err => {
            if (err) {
                console.log(err)
                return res.json({
                    error: err,
                    success: false
                })
            } else {
                db.run(sql1, err => {
                    if (err) {
                        return res.json({
                            error: err,
                            success: false
                        })
                    } else {
                        return res.json({
                            success: true,
                            message: 'Data Edited'
                        })
                    }
                })
            }
        });
    })
}

exports.getDataFromAssignLayout = (req, res, next) => {
    const email = req.params.email;
    const uuid = req.params.uuid;

    const db = new sqlite3.Database(databasePath);

    db.serialize(() => {
        db.all(`SELECT * FROM assign_layout WHERE email='${email}' and uuid='${uuid}'`, (err, rows) => {
            if (err) {
                console.log('check', err);
                return res.json({
                    error: err,
                    success: false
                })
            } else if (rows.length == 0) {
                return res.json({
                    success: false,
                    message: 'No data corresponding to this email and url'
                })
            } else {
                let data = [];
                rows.forEach(row => {
                    data.push({
                        startdate: row.startdate,
                        enddate: row.enddate,
                        layout_id: row.layout_id,
                        active: row.active,
                        url: row.url,
                        imageurl: row.imageurl,
                        title: row.title,
                        content: row.content
                    })
                })
                return res.json({
                    data: data,
                    success: true
                })
            }
        })
    })
}

exports.deleteRowInAssignLayout = (req, res, next) => {
    const email = req.body.email;
    const uuid = req.body.uuid;
    const startdate = req.body.startdate;
    const enddate = req.body.enddate;

    // console.log(email, uuid, startdate, enddate);

    const db = new sqlite3.Database(databasePath);
    // console.log(`DELETE FROM assign_layout where email='${email}' and url='${uuid}' and startdate='${startdate}' and enddate='${enddate}'`);

    db.serialize(() => {
        db.run(`DELETE FROM assign_layout where email='${email}' and uuid='${uuid}' and startdate='${startdate}' and enddate='${enddate}'`, err => {
            if (err) {
                console.log(err);

                return res.json({
                    success: false,
                    error: err
                })
            }

            return res.json({
                success: true,
                message: 'Email deleted'
            })
        });
    })
}

exports.getdata = (req, res, next) => {

    const db = new sqlite3.Database(databasePath);

    db.serialize(() => {
        db.all(`SELECT * FROM assign_layout`, [], (err, rows) => {
            if (err) {
                console.log(err)
                return res.json({
                    error: err,
                    success: false
                })
            }
            let data = [];

            rows.forEach(row => {
                data.push({
                    startdate: row.startdate,
                    enddate: row.enddate,
                    layout_id: row.layout_id,
                    active: row.active,
                    url: row.url,
                    imageurl: row.imageurl,
                    title: row.title,
                    content: row.content,
                    uuid: row.uuid,
                    email: row.email
                })
            })
            return res.json({
                data: data
            })
        })
    })
}

const getHTMLData = (name, title, content, imageurl) => {
    let dir = path.join(__dirname, '../assets')
    console.log(path.join(dir, name));
    let val = fs.readFileSync(path.join(dir, name), 'utf-8');
    let htmlList = val.split('<head>');
    let style = htmlList[1].split('</head>');
    let result = style[0] + style[1];

    result = result.replace("___TITLE___", title);
    result = result.replace("___CONTENT___", content);
    result = result.replace("___IMAGE___", imageurl);
    return result;
}

exports.renderScripts = (req, res, next) => {
    res.setHeader('Content-Type', 'text/plain');
    const uuid = req.params.uuid;

    const db = new sqlite3.Database(databasePath);

    db.serialize(() => {
        db.all(`SELECT * FROM uuidtable WHERE uuid='${uuid}'`, [], (err, rows) => {
            if (err) {
                console.log('renderScripts ', err);
                return res.json({
                    error: err,
                    success: false
                })
            }
            let email = rows[0].email;
            let url = rows[0].url;
            console.log(email, url)

            db.all(`SELECT * FROM assign_layout WHERE email='${email}' and url='${url}'`, (err, rows) => {
                if (err) {
                    console.log('renderScripts ', err);
                }

                let dataPassed = false;

                rows.forEach(row => {
                    let currentTimestamp = new Date().getTime();
                    let startdate = row.startdate;
                    let enddate = row.enddate;

                    let startList = startdate.split('-');
                    // console.log(startList[1] + "," + startList[0] + "," + startList[2])
                    let startTimestamp = new Date(startList[1] + "," + startList[2] + "," + startList[0]).getTime();

                    let endList = enddate.split('-');
                    // console.log(endList[1] + "," + endList[0] + "," + endList[2])
                    let endTimestamp = new Date(endList[1] + "," + endList[2] + "," + endList[0]).getTime();

                    console.log(currentTimestamp, startdate, enddate, startTimestamp, endTimestamp);


                    if (currentTimestamp <= endTimestamp && currentTimestamp >= startTimestamp) {
                        dataPassed = true;
                        let layout_id = row.layout_id;
                        let val = getHTMLData(layout_id.toString() + '.html', row.title, row.content, row.imageurl);
                        console.log('data')
                        return res.send(val);
                    }
                });
                if (dataPassed == false) {
                    console.log('ran');
                    return res.send("")
                }
            })
        })
    })
}

// 79627aa7-1268-44fa-90a0-aa95d4437a3a