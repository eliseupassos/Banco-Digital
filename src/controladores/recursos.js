const bancodedados = require('../bancodedados');
const { acharConta, acharIndiceConta, gerarData, buscarRegistros, padronizarConta, verificacaoCompletaDaConta } = require('./functions');
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
let organizadorDeNumeros = 0;
const criarConta = (req, res) => {
    let conta = req.body
    conta = padronizarConta(conta);
    const verificar = verificacaoCompletaDaConta(req, res, conta, bancodedados)
    if (verificar) {
        return verificar
    }
    let numeroDaConta = 1;
    if (organizadorDeNumeros) {
        numeroDaConta += organizadorDeNumeros
    }
    if (bancodedados.contas.length !== 0) {
        for (let i of bancodedados.contas) {
            while (Number(i.numero) >= numeroDaConta) {
                numeroDaConta++
            };
        };
    };
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
    let contaAtualizada = req.body
    const indice = acharIndiceConta(bancodedados, numeroDaConta);
    contaAtualizada = padronizarConta(contaAtualizada);
    let conta = acharConta(bancodedados, numeroDaConta);
    if (!conta) {
        return res.status(400).json({ 'mensagem': 'Verificar se o numero da conta passado como parametro na URL é válida' })
    };
    bancodedados.contas.splice(indice, 1);
    const verificar = verificacaoCompletaDaConta(req, res, contaAtualizada, bancodedados)
    if (verificar) {
        bancodedados.contas.splice(indice, 0, conta);
        return verificar
    }
    conta = {
        numero: conta.numero,
        saldo: conta.saldo,
        usuario: {
            ...contaAtualizada
        }
    };
    bancodedados.contas.splice(indice, 0, conta);
    return res.status(200).json();
};
const excluirConta = (req, res) => {
    const numeroDaConta = req.params.numeroConta;
    const conta = acharConta(bancodedados, numeroDaConta);
    const indice = acharIndiceConta(bancodedados, numeroDaConta)
    if (!conta) {
        return res.status(400).json({ 'mensagem': 'Verificar se o numero da conta passado como parametro na URL é válida' })
    };
    if (conta.saldo !== 0) {
        return res.status(400).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" })
    };
    bancodedados.contas.splice(indice, 1);
    if (Number(numeroDaConta) > organizadorDeNumeros) {
        organizadorDeNumeros = Number(numeroDaConta);
    }
    return res.status(200).json();
};
const depositar = (req, res) => {
    const numeroDaConta = String(req.body.numero_conta);
    const valor = Number(req.body.valor);
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
    if (valor <= 0) {
        return res.status(400).json({
            'mensagem': 'Não é permitido depósitos com valores negativos ou zerados'
        });
    };
    const indice = acharIndiceConta(bancodedados, numeroDaConta)
    conta = {
        numero: conta.numero,
        saldo: conta.saldo + valor,
        usuario: {
            ...conta.usuario
        }
    };
    bancodedados.contas.splice(indice, 1, conta);
    const data = gerarData();
    const registro = {
        "data": data,
        "numero_conta": numeroDaConta,
        "valor": valor
    };
    bancodedados.depositos.push(registro);
    return res.status(200).json();
};
const sacar = (req, res) => {
    const numeroDaConta = String(req.body.numero_conta);
    const valor = Number(req.body.valor);
    const senha = String(req.body.senha);
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
            'mensagem': 'Senha incorreta'
        });
    };
    if (valor <= 0) {
        return res.status(400).json({
            "mensagem": "O valor não pode ser menor ou igual a zero!"
        });
    };
    if (conta.saldo < valor) {
        return res.status(400).json({
            "mensagem": "O valor é maior que o saldo disponível"
        });
    };
    const indice = acharIndiceConta(bancodedados, numeroDaConta);
    conta = {
        numero: conta.numero,
        saldo: conta.saldo - valor,
        usuario: {
            ...conta.usuario
        }
    };
    bancodedados.contas.splice(indice, 1, conta);
    const data = gerarData();
    const registro = {
        "data": data,
        "numero_conta": numeroDaConta,
        "valor": valor
    };
    bancodedados.saques.push(registro);
    return res.status(200).json();
};
const transferir = (req, res) => {
    const numeroDaContaOrigem = String(req.body.numero_conta_origem);
    const numeroDaContaDestino = String(req.body.numero_conta_destino);
    const valor = Number(req.body.valor);
    const senha = String(req.body.senha);
    if (!numeroDaContaDestino || !numeroDaContaOrigem || !valor || !senha) {
        return res.status(400).json({
            'mensagem': 'Verificar se foi informado o número da conta de origem, número da conta de destino, valor e senha'
        });
    };
    let contaOrigem = acharConta(bancodedados, numeroDaContaOrigem);
    if (!contaOrigem) {
        return res.status(404).json({
            'mensagem': 'Conta de origem não encontrada'
        });
    };
    if (contaOrigem.usuario.senha !== senha) {
        return res.status(403).json({
            'mensagem': 'Senha inválida'
        });
    };
    let contaDestino = acharConta(bancodedados, numeroDaContaDestino)
    if (!contaDestino) {
        return res.status(404).json({
            'mensagem': 'Conta de destino não encontrada'
        });
    };
    if (valor < 1) {
        return res.status(400).json({
            "mensagem": "Valor deve ser maior que 0"
        });
    };
    if (contaOrigem.saldo < valor) {
        return res.status(400).json({
            'mensagem': 'Saldo insuficiente para realizar a transferência'
        })
    }
    contaOrigem = {
        numero: contaOrigem.numero,
        saldo: contaOrigem.saldo - valor,
        usuario: {
            ...contaOrigem.usuario
        }
    };
    contaDestino = {
        numero: contaDestino.numero,
        saldo: contaDestino.saldo + valor,
        usuario: {
            ...contaDestino.usuario
        }
    };
    const indiceContaOrigem = acharIndiceConta(bancodedados, numeroDaContaOrigem);
    const indiceContaDestino = acharIndiceConta(bancodedados, numeroDaContaDestino);
    bancodedados.contas.splice(indiceContaOrigem, 1, contaOrigem);
    bancodedados.contas.splice(indiceContaDestino, 1, contaDestino);
    const data = gerarData();
    const registro = {
        "data": data,
        "numero_conta_origem": numeroDaContaOrigem,
        "numero_conta_destino": numeroDaContaDestino,
        "valor": valor
    };
    bancodedados.transferencias.push(registro);
    return res.status(200).json();
};
const saldo = (req, res) => {
    const numeroDaConta = req.query.numero_conta;
    const senha = req.query.senha;
    if (!numeroDaConta || !senha) {
        return res.status(400).json({ 'mensagem': 'Informar número da conta e a senha da conta na URL' });
    }
    const conta = acharConta(bancodedados, numeroDaConta)
    if (!conta) {
        return res.status(404).json({
            "mensagem": "Conta bancária não encontrada!"
        });
    };
    return res.status(200).json({
        "saldo": conta.saldo
    });
};
const extrato = (req, res) => {
    const numeroDaConta = req.query.numero_conta;
    const senha = req.query.senha;
    if (!numeroDaConta || !senha) {
        return res.status(400).json({ 'mensagem': 'Informar número da conta e a senha da conta na URL' });
    }
    const conta = acharConta(bancodedados, numeroDaConta)
    if (!conta) {
        return res.status(404).json({
            "mensagem": "Conta bancária não encontada!"
        });
    }
    const depositos = buscarRegistros(bancodedados.depositos, numeroDaConta);
    const transferenciasEnviadas = buscarRegistros(bancodedados.transferencias, numeroDaConta, "origem");
    const transferenciasRecebidas = buscarRegistros(bancodedados.transferencias, numeroDaConta, "destino");
    const saques = buscarRegistros(bancodedados.saques, numeroDaConta);
    const extrato = {
        "depositos": depositos,
        "saques": saques,
        "transferenciasEnviadas": transferenciasEnviadas,
        "transferenciasRecebidas": transferenciasRecebidas
    };
    return res.status(200).json(extrato);
};

module.exports = {
    validacao,
    listarContasBancarias,
    criarConta,
    atualizarConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}