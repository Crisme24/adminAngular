var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            res.status(401).json({
                ok: false,
                message: 'Token invalid',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
}

//================================================
//verifica si el usuario es un administrador
//=================================================

exports.verificaADMIN = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN') {
        next();
        return;
    } else {
        res.status(401).json({
            ok: false,
            message: 'Token invalid',
            errors: err
        });
    }
}

//================================================
//verifica si el usuario es un administrador o 
//es el mismo usuario que esta logeado
//=================================================

exports.verifica_Id_Role = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN' || usuario._id === id) {
        next();
        return;
    } else {
        res.status(401).json({
            ok: false,
            message: 'Token invalid',
            errors: err
        });
    }
}