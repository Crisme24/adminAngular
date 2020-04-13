var router = require('express').Router();

var UsuarioController = require('../controllers/UsuarioController');
var mdAutenticacion = require('../middlewares/authentication');

router.get('/', UsuarioController.get);
router.post('/', UsuarioController.store);
router.put('/:id', mdAutenticacion.verificaToken, UsuarioController.update);
router.delete('/:id', mdAutenticacion.verificaToken, UsuarioController.delete);
router.post('/login', UsuarioController.login);
router.post('/google', UsuarioController.google);


module.exports = router;