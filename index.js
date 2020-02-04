const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');


const userRoutes = require('./routes/user');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'))

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

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.listen(8000,()=>{
    console.log('server running');
    
})

app.use('/',userRoutes,dashboardRoutes);


