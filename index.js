const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');


const userRoutes = require('./routes/user');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');
app.set('views', 'views');


const initializePassport = require('./config/passport-config');
initializePassport(passport);

app.use(flash());
app.use(session({
    secret:'mysecret',
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

app.listen(8000,()=>{
    console.log('server running');
    
})

app.use('/',userRoutes);

