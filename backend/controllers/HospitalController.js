var Hospital = require('../models/hospital');


var HospitalController = {

    get: (req, res) => {

        var desde = req.query.desde || 0;
        desde = Number(desde);

        Hospital.find({})
            .populate('usuario', 'name email')
            .skip(desde)
            .limit(5)
            .exec(
                (err, hospitales) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error loading hospitals',
                            errors: err
                        });
                    }
                    Hospital.count({}, (err, conteo) => {
                        res.status(200).json({
                            ok: true,
                            hospitales: hospitales,
                            total: conteo
                        });
                    });
                }
            );
    },

    getOne: (req, res) => {
        var id = req.params.id;
        Hospital.findById(id)
            .populate('usuario', 'name img email')
            .exec((err, hospital) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Search error'
                    });
                }
                if (!hospital) {
                    return res.status(400).json({
                        ok: false,
                        message: 'The hospital with the id ' + id + 'does not exist'
                    });
                }

                return res.status(200).json({
                    ok: true,
                    hospital: hospital
                });
            });
    },

    update: (req, res) => {

        var id = req.params.id;
        var body = req.body;

        Hospital.findById(id, (err, hospital) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Hospital not found',
                    errors: err
                });
            }

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    message: 'Hospital with id' + id + 'does not exist',
                    errors: { message: 'hospital does not exist with that id' }
                });
            }

            hospital.name = body.name;
            hospital.usuario = req.usuario._id;

            hospital.save((err, hospitalGuardado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error when trying to updated the hospital',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    hospital: hospitalGuardado
                });
            });
        });

    },

    store: (req, res) => {

        var body = req.body;

        var hospital = new Hospital({
            name: body.name,
            usuario: req.usuario._id,
        });

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error when trying to create the hospital',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    },

    delete: (req, res) => {

        var id = req.params.id;

        Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error when trying to deleted the hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalBorrado
            });
        });
    },
}

module.exports = HospitalController;