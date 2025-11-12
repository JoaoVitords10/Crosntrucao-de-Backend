const express = require('express'); 
const authMiddleware = require('../middlewares/authMiddleware'); 
const router = express.Router(); 


router.post('/login', (req, res) => { 
    try {
        const email = req.body.usuario; 
        if (!email) {
            return res.status(400).json({ msg: "Campo 'usuario' (email) não fornecido."});
        }
        const token = authMiddleware.gerarToken({ email: email });
        res.status(200).json({ token: token });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.post('/renovar', authMiddleware.verificarToken, (req, res) => { // (i)
    try {
        const email = req.usuario.email; 
        
        const token = authMiddleware.gerarToken({ email: email });
        res.status(200).json({ token: token });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});


module.exports = router;