var router = require('express').Router();

var UsuarioController = require('../controllers/UsuarioController');
var mdAutenticacion = require('../middlewares/authentication');

router.get('/', UsuarioController.get);
router.post('/', UsuarioController.store);
router.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verifica_Id_Role],
    UsuarioController.update);
router.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN],
    UsuarioController.delete);
router.post('/login', UsuarioController.login);
router.post('/google', UsuarioController.google);
router.get('/token', mdAutenticacion.verificaToken, UsuarioController.renovateToken);


module.exports = router;