var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var UsuarioController = {

    get: (req, res) => {

        var desde = req.query.desde || 0;
        desde = Number(desde);

        Usuario.find({}, 'name email img role')
            .skip(desde)
            .limit(3)
            .then(users => res.send({
                usuario: users,
                total: 20
            }))

    },

    update: (req, res) => {

        var id = req.params.id;
        var body = req.body;

        Usuario.findById(id, (err, usuario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'User not found',
                    errors: err
                });
            }

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    message: 'User with id' + id + 'does not exist',
                    errors: { message: 'User does not exist with that id' }
                });
            }

            usuario.name = body.name;
            usuario.email = body.email;
            usuario.role = body.role;

            usuario.save((err, usuarioGuardado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error when trying to updated the user',
                        errors: err
                    });
                }

                usuarioGuardado.password = ':)';

                res.status(200).json({
                    ok: true,
                    usuario: usuarioGuardado
                });
            });
        });

    },

    store: (req, res) => {
        var body = req.body;
        var usuario = new Usuario({
            name: body.name,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            img: body.img,
            role: body.role,
        });

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error when trying to create the user',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                usuario: usuarioGuardado,
                usuarioToken: req.usuario
            });
        });
    },

    delete: (req, res) => {

        var id = req.params.id;

        Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error when trying to deleted the user',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioBorrado
            });
        });
    },

    login: (req, res) => {

        var body = req.body;

        Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'User not found',
                    errors: err
                });
            }

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'Incorrect credentials - email',
                    errors: err
                });
            }

            if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                return res.status(400).json({
                    ok: false,
                    message: 'Incorrect credentials - password',
                    errors: err
                });
            }

            usuarioDB.password = ':)';

            var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

            res.status(200).json({
                ok: true,
                usuario: usuarioDB,
                token: token,
                id: usuarioDB._id
            });
        });
    }
}

module.exports = UsuarioController;