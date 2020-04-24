var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var fileUpload = require('express-fileupload');


var app = express();
var PORT = 3000;
var PORTDB = 27017;

var usersRoutes = require('./routes/usuarios');
var hospitalRoutes = require('./routes/hospitales');
var medicoRoutes = require('./routes/medicos');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));


//evitar que salga req.body undefined para bodies json y urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/users', usersRoutes);
app.use('/hospitales', hospitalRoutes);
app.use('/medicos', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log('DB running on port ' + PORTDB + ' ' + '\x1b[36m%s\x1b[0m', 'online');
});


app.listen(PORT, () => {
    return console.log('Backend running on port ' + PORT + ' ' + '\x1b[35m%s\x1b[0m', 'online');
});