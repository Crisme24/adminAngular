var router = require('express').Router();

var ImagenesController = require('../controllers/ImagenesController');

router.get('/:tipo/:img', ImagenesController.get);

module.exports = router;