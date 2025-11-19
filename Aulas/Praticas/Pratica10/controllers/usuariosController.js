const { cifrarSenha, gerarToken, compararSenha } = require('../middlewares/authMiddleware');
const Usuario = require('../models/usuariosModel'); 
async function criar(req, res) {
    if (!req.body.email || !req.body.senha) {
        return res.status(422).json({ msg: "Email e Senha são obrigatórios" });
    }

    try {
        const senhaCifrada = cifrarSenha(req.body.senha);
        const novoUsuario = await Usuario.create({
            email: req.body.email,
            senha: senhaCifrada
        });
        res.status(201).json({ _id: novoUsuario._id, email: novoUsuario.email });
    } catch (err) {
        res.status(422).json({ msg: "Erro ao criar usuário" });
    }
}


async function entrar(req, res) {
    const usuarioEncontrado = await Usuario.findOne({ email: req.body.usuario });
    
    if (usuarioEncontrado) {
        const senhaValida = compararSenha(req.body.senha, usuarioEncontrado.senha);
        if (senhaValida) {
            const token = gerarToken({ email: req.body.usuario });
            return res.status(200).json({ token });
        }
    }
    return res.status(401).json({ msg: "Credenciais inválidas" });
}

    async function renovar(req, res) {
        const token = gerarToken({ email: req.usuario.email }); 
        res.status(200).json({ token });
    }

    async function remover(req, res) {
        await Usuario.findOneAndDelete({ _id: req.params.id });
        res.status(204).end();
    }

    module.exports = { criar, entrar, renovar, remover };