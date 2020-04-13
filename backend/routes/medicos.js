var router = require('express').Router();

var MedicoController = require('../controllers/MedicoController');
var mdAutenticacion = require('../middlewares/authentication');

router.get('/', MedicoController.get);
router.get('/:id', MedicoController.getOne);
router.post('/', mdAutenticacion.verificaToken, MedicoController.store);
router.put('/:id', mdAutenticacion.verificaToken, MedicoController.update);
router.delete('/:id', mdAutenticacion.verificaToken, MedicoController.delete);


module.exports = router;