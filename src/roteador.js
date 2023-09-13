const express = require('express');
const recursos = require('./controladores/recursos');
const rota = express();




rota.get('/contas', recursos.validacao, recursos.listarContasBancarias)
rota.post('/contas', recursos.criarConta)
rota.put('/contas/:numeroConta/usuario', recursos.atualizarConta)


module.exports = rota