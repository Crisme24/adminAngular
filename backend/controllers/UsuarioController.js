var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

var UsuarioController = {

    get: (req, res) => {

        var desde = req.query.desde || 0;
        desde = Number(desde);

        Usuario.find({}, 'name email img role google')
            .skip(desde)
            .limit(5)
            .exec(
                (err, usuarios) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error loading user',
                            errors: err
                        });
                    }
                    Usuario.count({}, (err, conteo) => {
                        res.status(200).json({
                            ok: true,
                            usuarios: usuarios,
                            total: conteo
                        });
                    });
                }
            );

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
                        message: 'Update failed',
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
                    message: 'Sign up failed',
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

    //===============================
    //Login Normal
    //===============================

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
                id: usuarioDB._id,
                menu: obtenerMenu(usuarioDB.role)
            });
        });
    },

    //===============================
    //Login con Google
    //===============================

    google: async(req, res) => {

        var token = req.body.token;

        var googleUser = await verify(token)
            .catch(() => {
                return;
            });

        if (googleUser === undefined) {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no válido'
            });
        } else {

            Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'User not found',
                        errors: err
                    });
                }

                if (usuarioDB) {

                    if (usuarioDB.google === false) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Unauthenticated user',
                            errors: err
                        });
                    } else {
                        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

                        res.status(200).json({
                            ok: true,
                            usuario: usuarioDB,
                            token: token,
                            id: usuarioDB._id,
                            menu: obtenerMenu(usuarioDB.role)
                        });
                    }
                } else {
                    //El usuario no existe... hay que crearlo
                    var usuario = new Usuario();

                    usuario.name = googleUser.name;
                    usuario.email = googleUser.email;
                    usuario.img = googleUser.img;
                    usuario.google = true;
                    usuario.password = ':)';

                    usuario.save((err, usuarioDB) => {
                        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

                        res.status(200).json({
                            ok: true,
                            usuario: usuarioDB,
                            token: token,
                            id: usuarioDB._id,
                            menu: obtenerMenu(usuarioDB.role)
                        });
                    });
                }
            });

            // res.status(200).send({
            //     ok: true,
            //     message: 'ok',
            //     googleUser: googleUser
            // });
        }
    },

    renovateToken: (req, res) => {

        var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 });
        res.status(200).json({
            ok: true,
            token: token
        });
    }
};

//=======================================
//Funcion para verificar el token de Google
//=======================================

async function verify(token) {
    var ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    var payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


function obtenerMenu(role) {

    var menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'ProgressBar', url: '/progress' },
                { titulo: 'Graphics', url: '/graficas1' },
                //{ titulo: 'Promises', url: '/promesas'},
            ]
        },
        {
            titulo: 'Maintenance',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                //{ titulo: 'Users', url: '/users' },
                { titulo: 'Hospitals', url: '/hospitals' },
                { titulo: 'Doctors', url: '/doctors' },
            ]
        },
    ];

    if (role === 'ADMIN') {

        menu[1].submenu.unshift({ titulo: 'Users', url: '/users' });
    }

    return menu;
}

module.exports = UsuarioController;