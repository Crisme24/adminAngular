var Medico = require('../models/medico');


var MedicoController = {

    get: (req, res) => {
        Medico.find({})
            .populate('usuario', 'name email')
            .populate('hospital')
            .then(medicos => res.send(medicos))
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
                    doctor: medicoGuardado
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
                doctor: medicoGuardado
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
                doctor: medicoBorrado
            });
        });
    },
}

module.exports = MedicoController;