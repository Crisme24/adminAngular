var Medico = require('../models/medico');


var MedicoController = {

    get: (req, res) => {

        var desde = req.query.desde || 0;
        desde = Number(desde);

        Medico.find({}, 'name img email')
            .populate('usuario', 'name email')
            .populate('hospital')
            .skip(desde)
            .limit(5)
            .exec(
                (err, medicos) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error loading doctors',
                            errors: err
                        });
                    }
                    Medico.count({}, (err, conteo) => {
                        res.status(200).json({
                            ok: true,
                            medicos: medicos,
                            total: conteo
                        });
                    });
                }
            );
    },

    getOne: (req, res) => {

        var id = req.params.id;

        Medico.findById(id)
            .populate('usuario', 'name email, img')
            .populate('hospital')
            .exec((err, medico) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Can not show the doctor try later',
                        errors: err
                    });
                }
                if (!medico) {
                    return res.status(400).json({
                        ok: false,
                        message: 'The doctor with the id: ' + id + 'do not exists'
                    });
                }

                return res.status(200).json({
                    ok: true,
                    medico: medico
                });
            });
    },

    update: (req, res) => {

        var id = req.params.id;
        var body = req.body;

        Medico.findById(id, (err, medico) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Doctor not found',
                    errors: err
                });
            }

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    message: 'Doctor with id' + id + 'does not exist',
                    errors: { message: 'Doctor does not exist with that id' }
                });
            }

            medico.name = body.name;
            medico.usuario = req.usuario._id;
            medico.hospital = body.hospital;

            medico.save((err, medicoGuardado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error when trying to updated the doctor',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    medico: medicoGuardado
                });
            });
        });

    },

    store: (req, res) => {

        var body = req.body;

        var medico = new Medico({
            name: body.name,
            usuario: req.usuario._id,
            hospital: body.hospital
        });

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error when trying to create the doctor',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    },

    delete: (req, res) => {

        var id = req.params.id;

        Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error when trying to deleted the doctor',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoBorrado
            });
        });
    },
}

module.exports = MedicoController;