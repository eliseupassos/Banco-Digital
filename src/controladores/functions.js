const verificarBody = function (conta) {
    if (!conta.nome.trim() || !conta.cpf.trim() || !conta.data_nascimento.trim() || !conta.telefone.trim() || !conta.email.trim() || !conta.senha.trim()) {
        return false;
    };
    return true;
};

const verificarEmail_Cpf = function (bancodedadosContas, conta) {
    let status = true
    bancodedadosContas.every((verificar) => {
        return status = verificar.usuario.email !== conta.email;
    });
    if (!status) {
        return status
    }
    bancodedadosContas.every((verificar) => {
        return status = verificar.usuario.cpf !== conta.cpf;
    });
    return status
};

const acharConta = function (bancodedados, numeroDaConta) {
    return bancodedados.contas.find((acharConta) => {
        return acharConta.numero === numeroDaConta;
    });
};

module.exports = {
    verificarBody,
    verificarEmail_Cpf,
    acharConta
}