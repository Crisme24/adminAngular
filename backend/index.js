var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');

var app = express();
var PORT = 3000;
var PORTDB = 27017;

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('DB running on port ' + PORTDB + ' ' + '\x1b[36m%s\x1b[0m', 'online');
});

app.use(morgan('dev'));
//evitar que salga req.body undefined para bodies json y urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.options('/*',()=>res.send()) //si options da 404

app.listen(PORT, () => {
    return console.log('Backend running on port ' + PORT + ' ' + '\x1b[35m%s\x1b[0m', 'online');
});