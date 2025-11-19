var express = require('express');
var router = express.Router();
var usuariosController = require('../controllers/usuariosController');
var { verificarToken } = require('../middlewares/authMiddleware');


router.post('/', usuariosController.criar);
router.post('/login', usuariosController.entrar);
router.post('/renovar', verificarToken, usuariosController.renovar);
router.delete('/:id', verificarToken, usuariosController.remover);


module.exports = router;
