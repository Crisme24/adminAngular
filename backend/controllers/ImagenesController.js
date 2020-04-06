var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
const path = require('path');
const fs = require('fs');

var ImagenesController = {

    get: (req, res) => {

        var tipo = req.params.tipo;
        var img = req.params.img;

        var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

        if (fs.existsSync(pathImagen)) {
            res.sendFile(pathImagen);
        } else {
            var pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
            res.sendFile(pathNoImagen);
        }

    }
}

module.exports = ImagenesController;