var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var UploadController = {

    upload: (req, res) => {

        var tipo = req.params.tipo;
        var id = req.params.id;

        var typeValid = ['hospitales', 'usuarios', 'medicos'];

        if (typeValid.indexOf(tipo) < 0) {
            return res.status(400).send({
                ok: false,
                message: 'Type of collection is not valid'
            });
        }

        if (!req.files) {
            return res.status(400).send({
                ok: false,
                message: 'No files were uploaded'
            });

        }

        var archivo = req.files.imagen;
        var nombreAndExt = archivo.name.split('.');
        var extArchivo = nombreAndExt[nombreAndExt.length - 1];
        var extValid = ['png', 'jpg', 'gif', 'jpeg'];

        if (extValid.indexOf(extArchivo) < 0) { //Menos 1 (-1) en esta funcion quiere decir que no lo encontro
            return res.status(400).send({
                ok: false,
                message: 'Extension not valid',
                errors: { message: 'Valid extension are ' + extValid.join(', ') }
            });
        }

        var nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extArchivo}`;

        var path = `./uploads/${tipo}/${nombreArchivo}`;

        archivo.mv(path, err => {
            if (err) {
                return res.status(400).send({
                    ok: false,
                    message: 'Error moving file'
                });
            }

            subirPorTipo(tipo, id, nombreArchivo, res);

            // res.status(200).json({
            //     ok: true,
            //     message: 'File moved'
            // });
        });
    },

}

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    message: 'User does not exists'
                });
            }

            var pathOld = './uploads/usuarios/' + usuario.img;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathOld)) {
                fs.unlinkSync(pathOld);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    message: 'Img users updated',
                    usuario: usuarioActualizado
                });
            });
        });
    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    message: 'Hospital does not exists'
                });
            }

            var pathOld = './uploads/hospitales/' + hospital.img;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathOld)) {
                fs.unlinkSync(pathOld);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    message: 'Img hospital updated',
                    hospital: hospitalActualizado
                });
            });
        });

    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    message: 'Doctor does not exists'
                });
            }

            var pathOld = './uploads/medicos/' + medico.img;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathOld)) {
                fs.unlinkSync(pathOld);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    message: 'Img doctor updated',
                    medico: medicoActualizado
                });
            });
        });
    }
}

module.exports = UploadController;