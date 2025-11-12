const mongoose = require('mongoose');
const Produto = require('../models/produtosModel');

async function criar(req, res) {
    try {
        const { nome, preco } = req.body;
        const novoProduto = await Produto.create({ nome, preco });
        res.status(201).json(novoProduto);
    } catch (error) {
        res.status(422).json({ msg: "Nome e preço do produto são obrigatórios" });
    }
}

async function listar(req, res) {
    const produtosCadastrados = await Produto.find({});
    res.status(200).json(produtosCadastrados);
}

async function buscar(req, res, next) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Parâmetro inválido" });
    }

    try {
       
        const produtoEncontrado = await Produto.findById(id);

        if (produtoEncontrado) {
            req.produto = produtoEncontrado; 
            return next(); 
        } else {
            return res.status(404).json({ msg: "Produto não encontrado" });
        }
    } catch (error) {
        return res.status(500).json({ msg: "Erro interno no servidor" });
    }
}

function exibir(req, res) {
    res.status(200).json(req.produto);
}


async function atualizar(req, res) {
    try {
        const { nome, preco } = req.body;
        await Produto.updateOne(
            { _id: req.produto._id },
            { $set: { nome: nome, preco: preco } },
            { runValidators: true } 
        );

        const produtoAtualizado = {
            _id: req.produto._id,
            nome: nome,
            preco: preco
        };
        
        res.status(200).json(produtoAtualizado);

    } catch (error) {
        res.status(422).json({ msg: "Nome e preço do produto são obrigatórios" });
    }
}

async function remover(req, res) {
   
    await Produto.findOneAndDelete({ _id: req.produto._id });
    
    res.status(204).send(); 
}


module.exports = {
    criar,
    listar,
    buscar,
    exibir,
    atualizar,
    remover
};