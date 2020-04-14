var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');


var BusquedaController = {

    //==============================
    //BUSQUEDA ESPECIFICA
    //==============================

    getOne: (req, res) => {
        var busqueda = req.params.busqueda;
        var tabla = req.params.tabla;
        var regex = new RegExp(busqueda, 'i');
        var promesa;

        switch (tabla) {

            case 'usuarios':
                promesa = buscarUsuarios(busqueda, regex);
                break;

            case 'hospitales':
                promesa = buscarHospitales(busqueda, regex);
                break;

            case 'medicos':
                promesa = buscarMedicos(busqueda, regex);
                break;

            default:
                return res.status(400).json({
                    ok: false,
                    message: 'Request error'
                });
        }

        promesa.then(data => {
            res.status(200).json({
                ok: true,
                [tabla]: data

            });
        });
    },

    //===============================
    //BUSQUEDA GENERAL
    //===============================

    get: (req, res) => {
        /* Es para hacer una busquedad en una sola collection
        var busqueda = req.params.busqueda;
        var regex = new RegExp(busqueda, 'i'); //expresion regular

        Hospital.find({ name: regex }, (err, hospitales) => {
            res.status(200).json({
                ok: true,
                hospitales: hospitales
            });
        });
    },

    */

        var busqueda = req.params.busqueda;
        var regex = new RegExp(busqueda, 'i');

        Promise.all([
                buscarHospitales(busqueda, regex),
                buscarMedicos(busqueda, regex),
                buscarUsuarios(busqueda, regex)
            ])
            .then(resp => {
                res.status(200).json({
                    ok: true,
                    hospitales: resp[0],
                    medicos: resp[1],
                    usuarios: resp[2]
                });
            });
    },

}

function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Hospital.find({ name: regex })
            .populate('usuario', 'name email img')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Request error', err);
                } else {
                    resolve(hospitales)
                }
            });
    });

}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Medico.find({ name: regex })
            .populate('usuario', 'name email img')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Request error', err);
                } else {
                    resolve(medicos)
                }
            });
    });

}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'name email role img')
            .or([{ 'name': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Request error', err);
                } else {
                    resolve(usuarios);
                }
            });
    });

}

module.exports = BusquedaController;