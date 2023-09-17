const { format } = require('date-fns');
const verificarBody = function (conta, res) {
    if (!conta.nome.trim() || !conta.cpf.trim() || !conta.data_nascimento.trim() || !conta.telefone.trim() || !conta.email.trim() || !conta.senha.trim()) {
        return false
    };
    return true
};

const verificarEmail_Cpf = function (bancodedadosContas, conta) {
    let status = true
    let identificador = 0
    bancodedadosContas.every((verificar) => {
        return status = verificar.usuario.email !== conta.email;
    });
    if (!status) {
        identificador = identificador + 1
    }
    bancodedadosContas.every((verificar) => {
        return status = verificar.usuario.cpf !== String(conta.cpf);
    });
    if (!status) {
        identificador = identificador + 2
    }
    if (identificador === 0 || identificador === 3) {
        return status
    }
    console.log(identificador)
    return identificador
};

const acharConta = function (bancodedados, numeroDaConta) {
    return bancodedados.contas.find((acharConta) => {
        return acharConta.numero === numeroDaConta;
    });
};

const acharIndiceConta = function (bancodedados, numeroDaConta) {
    const indice = bancodedados.contas.findIndex((indice) => {
        return indice.numero === numeroDaConta;
    });
    return indice
};

const gerarData = function () {
    let date = new Date();
    const formatoDate = 'yyyy-MM-dd HH:mm:ss';
    return date = format(date, formatoDate);
};

const buscarRegistros = function (bancodedadosRegistro, numeroDaConta, destinoOuOrigem) {
    const situacao = destinoOuOrigem;
    let registro;
    if (!situacao) {
        registro = bancodedadosRegistro.filter((elemento) => {
            return elemento.numero_conta === numeroDaConta;
        });
    };
    if (situacao === "origem") {
        registro = bancodedadosRegistro.filter((elemento) => {
            return elemento.numero_conta_origem === numeroDaConta;
        });
    };
    if (situacao === "destino") {
        registro = bancodedadosRegistro.filter((elemento) => {
            return elemento.numero_conta_destino === numeroDaConta;
        });
    };
    return registro;
};
const validarCpf = function (cpf) {
    if (cpf.length !== 11) {
        return false;
    }
    let validacao;
    for (let i of cpf) {
        if (i === "0" || i === "1" || i === "2" || i === "3" || i === "4" || i === "5" || i === "6" || i === "7" || i === "8" || i === "9") {
            validacao = true;
        } else {
            return false;
        };
    };
    return validacao;
};
const validarEmail = function (email) {
    const inicio = email.slice(0, 1)
    const final = email.slice(-1)
    if (inicio !== "." && final !== "." && email.includes("@") && email.includes(".")) {
        return true;
    }
    return false;
};
const validarNumero = function (numero) {
    if (numero.length !== 11) {
        return false
    }
    if (numero[2] !== "9") {
        return false
    }
    return true
}
const verificarDataDeNascimento = function (data_nascimento) {
    const date = data_nascimento
    const dateReferencia = new Date()
    if (date.length !== 10) {
        return false
    }
    let verificar = date.slice(0, 5)
    verificar = verificar.indexOf("-")
    if (verificar !== 4) {
        return false
    }
    verificar = Number(date.slice(0, 4))
    verificar = dateReferencia.getFullYear() - verificar
    if (verificar <= 0) {
        return false
    }
    verificar = date.slice(5, 7)
    if (Number(verificar) > 12 || !Number(verificar) || Number(verificar) < 0) {
        return false
    }
    verificar = date.slice(-3)
    verificar = verificar.indexOf("-")
    if (verificar !== 0) {
        return false
    }
    verificar = date.slice(-2)
    if (Number(verificar) > 31) {
        return false
    }
    return true
}
const padronizarConta = function (conta) {
    return conta = {
        nome: conta.nome,
        cpf: String(conta.cpf),
        data_nascimento: String(conta.data_nascimento),
        telefone: String(conta.telefone),
        email: conta.email,
        senha: String(conta.senha)
    }
}

const verificacaoCompletaDaConta = function (req, res, conta, bancodedados) {
    if (!verificarBody(conta)) {
        return res.status(400).json({
            'mensagem': 'Verificar se foi informado nome, cpf, data_nascimento, telefone, email e senha '
        });
    };
    if (!verificarEmail_Cpf(bancodedados.contas, conta)) {
        return res.status(401).json({
            "mensagem": "Já existe uma conta com o cpf e e-mail informado!"
        });
    };
    if (verificarEmail_Cpf(bancodedados.contas, conta) === 1) {
        return res.status(401).json({
            "mensagem": "O Email informado já existe cadastrado!"
        });
    };
    if (verificarEmail_Cpf(bancodedados.contas, conta) === 2) {
        return res.status(401).json({
            "mensagem": "O CPF informado já existe cadastrado!"
        });
    };

    if (!validarCpf(conta.cpf)) {
        return res.status(400).json({
            'mensagem': 'Cpf inválido. Passe somente os números do cpf e verifique se tem onze dígitos'
        });
    };
    if (!validarEmail(conta.email)) {
        return res.status(400).json({
            'mensagem': 'Email inválido.'
        });
    };
    if (!validarNumero(conta.telefone)) {
        return res.status(400).json({
            'mensagem': 'Telefone inválido. Passe somente os números e seguir o padrão DDD em seguida 9 e depois número. Exemplo: 71999998888'
        });
    };
    if (!verificarDataDeNascimento(conta.data_nascimento)) {
        return res.status(400).json({
            'mensagem': 'Data de nascimneto inválida. Informar data de nascimento seguindo o seguinte padrão: ano-mês-dia. Exemplo: 2021-03-02 '
        });
    }
};
module.exports = {
    acharConta,
    acharIndiceConta,
    gerarData,
    buscarRegistros,
    validarCpf,
    validarEmail,
    validarNumero,
    padronizarConta,
    verificacaoCompletaDaConta
}