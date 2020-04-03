var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');

var app = express();
var PORT = 3000;
var PORTDB = 27017;

var usersRouter = require('./routes/usuarios');
var hospitalRouter = require('./routes/hospitales');
var medicoRouter = require('./routes/medicos');

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
//evitar que salga req.body undefined para bodies json y urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/users', usersRouter);
app.use('/hospitales', hospitalRouter);
app.use('/medicos', medicoRouter);

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('DB running on port ' + PORTDB + ' ' + '\x1b[36m%s\x1b[0m', 'online');
});


app.listen(PORT, () => {
    return console.log('Backend running on port ' + PORT + ' ' + '\x1b[35m%s\x1b[0m', 'online');
});