var router = require('express').Router();

var HospitalController = require('../controllers/HospitalController');
var mdAutenticacion = require('../middlewares/authentication');

router.get('/', HospitalController.get);
router.get('/:id', HospitalController.getOne);
router.post('/', mdAutenticacion.verificaToken, HospitalController.store);
router.put('/:id', mdAutenticacion.verificaToken, HospitalController.update);
router.delete('/:id', mdAutenticacion.verificaToken, HospitalController.delete);


module.exports = router;