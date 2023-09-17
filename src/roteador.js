const express = require('express');
const recursos = require('./controladores/recursos');
const rota = express();

rota.get('/contas', recursos.validacao, recursos.listarContasBancarias);
rota.post('/contas', recursos.criarConta);
rota.put('/contas/:numeroConta/usuario', recursos.atualizarConta);
rota.delete('/contas/:numeroConta', recursos.excluirConta);
rota.post('/transacoes/depositar', recursos.depositar);
rota.post('/transacoes/sacar', recursos.sacar);
rota.post('/transacoes/transferir', recursos.transferir);
rota.get('/contas/saldo', recursos.saldo);
rota.get('/contas/extrato', recursos.extrato);
module.exports = rota;