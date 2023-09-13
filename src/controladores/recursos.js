const bancodedados = require('../bancodedados');
const { verificarBody, verificarEmail_Cpf } = require('./functions');
const validacao = (req, res, next) => {
    const senha = req.query.senha_banco;
    if (senha !== "Cubos123") {
        return res.status(403).json({ "mensagem": "A senha do banco informada é inválida!" })
    }
    next();
};
const listarContasBancarias = (req, res) => {
    return res.status(200).json(bancodedados.contas);
};
const criarConta = (req, res) => {
    let conta = req.body
    if (!verificarBody(conta)) {
        return res.status(400).json({ 'mensagem': 'verificar se foi informado nome, cpf, data_nascimento, telefone, email e senha ' });
    }
    if (!verificarEmail_Cpf(bancodedados, conta)) {
        return res.status(400).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" });
    }
    conta = {
        'numero': String(bancodedados.contas.length + 1),
        'saldo': 0,
        'usuario': {
            ...conta
        }
    }
    bancodedados.contas.push(conta);
    return res.status(201).json({});
};
const atualizarConta = (req, res) => {

};

module.exports = {
    validacao,
    listarContasBancarias,
    criarConta,
    atualizarConta

}