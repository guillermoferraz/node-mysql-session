const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const { database } =require('./keys');

const session = require('express-session');
const mySQLStore = require('express-mysql-session')(session);
const passport = require('passport')

const flash = require('connect-flash');

const app = express();


require('./lib/passport');

//settings
app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', 'hbs');

//middelwares

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: new mySQLStore(database)
}));

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//global variables

app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});


//Routes

app.use(require('./routes'));
app.use(require('./routes/auth'));
app.use(require('./routes/data'));
app.use(require('./routes/community'));

app.listen(app.get('port'), () => {
    console.log('Server on port',(app.get('port')))
});