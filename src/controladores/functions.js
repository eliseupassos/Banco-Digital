const verificarBody = function (conta) {
    if (!conta.nome.trim() || !conta.cpf.trim() || !conta.data_nascimento.trim() || !conta.telefone.trim() || !conta.email.trim() || !conta.senha.trim()) {
        return false;
    };
    return true;
};

const verificarEmail_Cpf = function (bancodedados, conta) {
    let status = true
    bancodedados.contas.every((verificar) => {
        return status = verificar.usuario.email !== conta.email;
    });
    bancodedados.contas.every((verificar) => {
        return status = verificar.usuario.cpf !== conta.cpf;
    });
    return status;
};






module.exports = {
    verificarBody,
    verificarEmail_Cpf
}