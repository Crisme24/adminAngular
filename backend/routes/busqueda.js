var router = require('express').Router();

var BusquedaController = require('../controllers/BusquedaController');

router.get('/todo/:busqueda', BusquedaController.get);
router.get('/coleccion/:tabla/:busqueda', BusquedaController.getOne);

module.exports = router;