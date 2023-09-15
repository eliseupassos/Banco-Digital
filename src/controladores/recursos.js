const bancodedados = require('../bancodedados');
const { verificarBody, verificarEmail_Cpf, acharConta } = require('./functions');
const { format } = require('date-fns');
const validacao = (req, res, next) => {
    const senha = req.query.senha_banco;
    if (senha !== "Cubos123") {
        return res.status(403).json({
            "mensagem": "A senha do banco informada é inválida!"
        })
    }
    next();
};
const listarContasBancarias = (req, res) => {
    return res.status(200).json(bancodedados.contas);
};
//*Corrigir a forma como é estabelecida as numerações devido a questão dos registros se caso deletar contas.
const criarConta = (req, res) => {
    let conta = req.body
    if (!verificarBody(conta)) {
        return res.status(400).json({
            'mensagem': 'Verificar se foi informado nome, cpf, data_nascimento, telefone, email e senha '
        });
    }
    if (!verificarEmail_Cpf(bancodedados.contas, conta)) {
        return res.status(401).json({
            "mensagem": "Já existe uma conta com o cpf ou e-mail informado!"
        });
    };
    let numeroDaConta = 1;
    let validacao = false
    while (!validacao) {
        const verificar = acharConta(bancodedados, String(numeroDaConta))
        if (!verificar) {
            validacao = true;
            break
        }
        numeroDaConta++
    }
    conta = {
        'numero': String(numeroDaConta),
        'saldo': 0,
        'usuario': {
            ...conta
        }
    }
    bancodedados.contas.push(conta);
    return res.status(201).json();
};
const atualizarConta = (req, res) => {
    const numeroDaConta = req.params.numeroConta
    const contaAtualizada = req.body
    if (!verificarBody(contaAtualizada)) {
        return res.status(400).json({
            'mensagem': 'Verificar se foi informado nome, cpf, data_nascimento, telefone, email e senha '
        });
    }
    const conta = acharConta(bancodedados, numeroDaConta);
    if (!conta) {
        return res.status(400).json({ 'mensagem': 'Verificar se o numero da conta passado como parametro na URL é válida' })
    };
    bancodedados.contas.splice(Number(numeroDaConta) - 1, 1);
    if (!verificarEmail_Cpf(bancodedados.contas, contaAtualizada)) {
        bancodedados.contas.splice(Number(numeroDaConta) - 1, 0, conta);
        return res.status(401).json({
            "mensagem": "Já existe uma conta com o cpf ou e-mail informado!"
        });
    }
    conta = {
        numero: conta.numero,
        saldo: conta.saldo,
        usuario: {
            ...contaAtualizada
        }
    };
    bancodedados.contas.splice(Number(numeroDaConta) - 1, 0, conta);
    return res.status(200).json({ 'mensagem': 'ok' });
};
const excluirConta = (req, res) => {
    const numeroDaConta = req.params.numeroConta
    const conta = acharConta(bancodedados, numeroDaConta);
    if (!conta) {
        return res.status(400).json({ 'mensagem': 'Verificar se o numero da conta passado como parametro na URL é válida' })
    };
    if (conta.saldo !== 0) {
        return res.status(400).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" })
    };
    bancodedados.contas.splice(Number(numeroDaConta) - 1, 1);
    return res.status(200).json();
};
const depositar = (req, res) => {
    const numeroDaConta = req.body.numero_conta;
    const valor = req.body.valor;
    if (!numeroDaConta || !valor) {
        return res.status(400).json({
            "mensagem": "O número da conta e o valor são obrigatórios!"
        });
    };
    let conta = acharConta(bancodedados, numeroDaConta);
    if (!conta) {
        return res.status(404).json({
            'mensagem': 'Conta não encontrada'
        });
    };
    if (Number(valor) <= 0) {
        return res.status(400).json({
            'mensagem': 'Não é permitido depósitos com valores negativos ou zerados'
        });
    };
    //* Enxutar o código com funções, tentar fazer funções com req,res na parte de functions
    const indice = bancodedados.contas.findIndex((indice) => {
        return indice.numero === numeroDaConta;
    });
    conta = {
        numero: conta.numero,
        saldo: conta.saldo + valor,
        usuario: {
            ...conta.usuario
        }
    };
    bancodedados.contas.splice(indice, 1, conta);
    //*Criar função para criar registros com datas.
    let date = new Date();
    const formatoDate = 'yyyy-MM-dd HH:mm:ss';
    date = format(date, formatoDate);
    const registro = {
        "data": date,
        "numero_conta": numeroDaConta,
        "valor": valor
    };
    bancodedados.depositos.push(registro);
    return res.status(200).json();
};
const sacar = (req, res) => {
    const numeroDaConta = req.body.numero_conta;
    const valor = req.body.valor;
    const senha = req.body.senha;
    //*Provavelmente essa parte vai se repetir em outras requisições. CRIAR FUNÇÃO    
    if (!numeroDaConta || !valor || !senha) {
        return res.status(400).json({
            "mensagem": "O número da conta, senha da conta e o valor são obrigatórios!"
        });
    };
    let conta = acharConta(bancodedados, numeroDaConta);
    if (!conta) {
        return res.status(404).json({
            'mensagem': 'Conta não encontrada'
        });
    };
    if (conta.usuario.senha !== senha) {
        return res.status(400).json({
            'mensagem': 'senha incorreta'
        });
    };
    if (valor <= 0) {
        return res.status(400).json({
            "mensagem": "O valor não pode ser menor que zero!"
        });
    };
    if (conta.saldo < valor) {
        return res.status(400).json({
            "mensagem": "O valor é maior que o saldo disponível"
        });
    };
    const indice = bancodedados.contas.findIndex((indice) => {
        return indice.numero === numeroDaConta;
    });
    conta = {
        numero: conta.numero,
        saldo: conta.saldo - valor,
        usuario: {
            ...conta.usuario
        }
    };
    bancodedados.contas.splice(indice, 1, conta);
    let date = new Date();
    const formatoDate = 'yyyy-MM-dd HH:mm:ss';
    date = format(date, formatoDate);
    const registro = {
        "data": date,
        "numero_conta": numeroDaConta,
        "valor": valor
    };
    bancodedados.saques.push(registro);
    return res.status(200).json();
};
module.exports = {
    validacao,
    listarContasBancarias,
    criarConta,
    atualizarConta,
    excluirConta,
    depositar,
    sacar
}