var router = require('express').Router();

var UploadController = require('../controllers/UploadController');

router.put('/:tipo/:id', UploadController.upload);

module.exports = router;