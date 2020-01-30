const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3');

const userRoutes = require('./routes/user');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');
app.set('views', 'views');


app.listen(8000,()=>{
    console.log('server running');
})

app.use('/',userRoutes);

