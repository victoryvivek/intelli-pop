const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const databasePath = path.join(__dirname, '../database/template');


exports.table = ()=>{
    const db = new sqlite3.Database(databasePath);
    console.log(db);
    
    // db.run(`DROP TABLE templateinfo`,err =>{
    //     if(err){
    //         console.log('err in table',err);
            
    //     }else{
    //         console.log('done');
            
    //     }
    // });

    db.run(`CREATE TABLE templateinfo(date DATE PRIMARY KEY NOT NULL, username VARCHAR NOT NULL, market VARCHAR NOT NULL,template VARCHAR NOT NULL)`,err =>{
        if(err){
            console.log('err in table',err);
            
        }else{
            console.log('done');
            
        }
    });
}



exports.setData = (req,res,next) =>{
    const market = req.body.market;
    const templateName = req.body.templateName;
    const date = req.body.date;
    const username = req.params.username;

    const db = new sqlite3.Database(databasePath);

    db.run(`INSERT INTO templateinfo(date,username,market,template) VALUES (${date},'${username}','${market}','${templateName}')`,err =>{
        if(err){
            console.log('err in table',err);
            
        }else{
            console.log('done');
        }
    });
}

exports.fetchData = (req,res,next)=>{
    const db = new sqlite3.Database(databasePath);

    db.serialize(()=>{

        db.all(`SELECT * FROM templateinfo`, [], (err, rows) => {
            if (err) {
              console.log('all',err);
            }
            if(rows.length==0){
                console.log('No data');
                
            }else{
                rows.forEach(row => {
                    console.log(''+row.date+' '+row.market+' '+row.username+' '+row.templateName);
                });
            }
            
          });
    });

    db.close();
}


exports.fetchTemplate = (req,res,next)=>{

    // const date;
    // const market;

    const db = new sqlite3.Database(databasePath);

    db.serialize(()=>{

        db.all(`SELECT template FROM templateinfo where date=${date} and market='${market}'`, [], (err, rows) => {
            if (err) {
              console.log('all',err);
            }
            if(rows.length==0){
                console.log('No data');
                
            }else{
                
            }
            
          });
    });

    db.close();
}