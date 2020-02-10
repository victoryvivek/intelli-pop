const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');


const userRoutes = require('./routes/user');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'))

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
});

const userControllers = require('./controllers/user');
const dashboardControllers = require('./controllers/dashboard');

app.listen(8000, () => {
    console.log('server running');
})

app.use('/api/', userRoutes, dashboardRoutes);