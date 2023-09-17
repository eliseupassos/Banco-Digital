# Projeto Bancário em JavaScript (Desenvolvido no Windows)

Este é um projeto JavaScript que implementa um sistema bancário simples. Ele permite listar contas bancárias, criar novas contas, atualizar dados de usuários, excluir contas, depositar, sacar, transferências, consulta de saldo e extrato.

## Pré-requisitos

- [Node v9.6.7+](https://nodejs.org/en)

## Preparar

```

git clone https://github.com/eliseupassos/Banco-Digital.git

npm install

```

As bibliotecas utilizadas neste projeto incluem:

- **[Express](https://www.npmjs.com/package/express)**: Um framework web para Node.js que facilita a criação de APIs.
- **[date-fns](https://www.npmjs.com/package/date-fns)**: Uma biblioteca para manipulação de datas em JavaScript.
- **[Nodemon](https://www.npmjs.com/package/nodemon)**: Uma ferramenta que reinicia automaticamente o servidor Node.js sempre que um arquivo é modificado durante o desenvolvimento.

## **Iniciando o Servidor**

Para iniciar o servidor, utilize o seguinte comando no terminal:

```bash

npm run dev

```

O servidor estará disponível em **[http://localhost:3000](http://localhost:3000/)**.

## **Executando os Testes**

A porta padrão para todas as requisições é 3000. A seguir estão exemplos detalhados de endpoints disponíveis:

### **Listar contas bancárias**

- **Método**: GET
- **Rota**: **`/contas?senha_banco=Cubos123Bank`**
- **Descrição**: Lista todas as contas bancárias existentes.

**Exemplo de Requisição:**

```

GET http://localhost:3000/contas?senha_banco=Cubos123Bank

```

**Exemplo de Resposta (em caso de sucesso):**
```json
[
    {
        "numero": "1",
        "saldo": 0,
        "usuario": {
            "nome": "Foo Bar",
            "cpf": "00011122233",
            "data_nascimento": "2021-03-15",
            "telefone": "71999998888",
            "email": "foo@bar.com",
            "senha": "1234"
        }
    },
    {
        "numero": "2",
        "saldo": 1000,
        "usuario": {
            "nome": "Foo Bar 2",
            "cpf": "00011122234",
            "data_nascimento": "2021-03-15",
            "telefone": "71999998888",
            "email": "foo@bar2.com",
            "senha": "12345"
        }
    }
]

```
**Exemplo de Resposta (em caso de erro):**
```json
{
    "mensagem": "A senha do banco informada é inválida!"
}

```

### **Criar conta bancária**

- **Método**: POST
- **Rota**: **`/contas`**
- **Descrição**: Cria uma nova conta bancária.

**Exemplo de Requisição:**

```

POST http://localhost:3000/contas
Content-Type: application/json
Body:
{
    "nome": "Foo Bar 2",
    "cpf": "00011122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar2.com",
    "senha": "12345"
}

```

**Exemplo de Resposta (em caso de erro):**

```json

{
    "mensagem": "Já existe uma conta com o cpf e e-mail informado!"
}

```

**Exemplo de Resposta (em caso de sucesso, sem conteúdo no corpo):**

```json

{}

```

### **Atualizar usuário da conta bancária**

- **Método**: PUT
- **Rota**: **`/contas/:numeroConta/usuário`**
- **Descrição**: Atualiza os dados do usuário de uma conta bancária.

**Exemplo de Requisição:**

```
PUT http://localhost:3000/contas/1/usuário
Content-Type: application/json
Body:
{
    "nome": "Foo Bar 3",
    "cpf": "99911122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar3.com",
    "senha": "12345"
}

```

**Exemplo de Resposta (em caso de erro):**

```json
{
    "mensagem": "O CPF informado já existe cadastrado!"
}

```

**Exemplo de Resposta (em caso de sucesso, sem conteúdo no corpo):**

```json
{}

```

### **Excluir Conta**

- **Método**: DELETE
- **Rota**: **`/contas/:numeroConta`**
- **Descrição**: Exclui uma conta bancária existente.

**Exemplo de Requisição:**

```

DELETE http://localhost:3000/contas/1

```

**Exemplo de Resposta (em caso de erro):**

```json
{
    "mensagem": "A conta só pode ser removida se o saldo for zero!"
}

```

**Exemplo de Resposta (em caso de sucesso, sem conteúdo no corpo):**

```json
{}

```

### **Depositar**

- **Método**: POST
- **Rota**: **`/transacoes/depositar`**
- **Descrição**: Realiza um depósito em uma conta bancária.
- **Atenção**: Todos os valores passados deveram ser em centavos. Exemplo: R$ 1,00 = 100.

**Exemplo de Requisição:**

```
POST http://localhost:3000/transacoes/depositar
Content-Type: application/json
Body:

{
    "numero_conta": "1",
    "valor": 1900
}

```

**Exemplo de Resposta (em caso de erro):**

```json
{
    "mensagem": "O número da conta e o valor são obrigatórios!"
}

```

**Exemplo de Resposta (em caso de sucesso, sem conteúdo no corpo):**

```json
{}

```

**Exemplo do registro de um depósito:**

```json
{
    "data": "2021-08-10 23:40:35",
    "numero_conta": "1",
    "valor": 10000
}

```

### **Sacar**

- **Método**: POST
- **Rota**: **`/transacoes/sacar`**
- **Descrição**: Realiza um saque em uma conta bancária.
- **Atenção**: Todos os valores passados deveram ser em centavos e serão mostrados no mesmo formato. Exemplo: R$ 1,00 = 100.

**Exemplo de Requisição:**

```
POST http://localhost:3000/transacoes/sacar
Content-Type: application/json
Body:
{
    "numero_conta": "1",
    "valor": 1900,
    "senha": "123456"
}

```

**Exemplo de Resposta (em caso de erro):**

```json
{
    "mensagem": "O valor não pode ser menor que zero!"
}

```

**Exemplo de Resposta (em caso de sucesso, sem conteúdo no corpo):**

```json
{}

```

**Exemplo do registro de um saque:**

```json
{
    "data": "2021-08-10 23:40:35",
    "numero_conta": "1",
    "valor": 10000
}

```

### **Transferir**

- **Método**: POST
- **Rota**: **`/transacoes/transferir`**
- **Descrição**: Permite a transferência de recursos (dinheiro) de uma conta bancária para outra e registra essa transação.
- **Atenção**: Todos os valores passados deveram ser em centavos e serão mostrados no mesmo formato. Exemplo: R$ 1,00 = 100.

**Exemplo de Requisição:**

```
POST http://localhost:3000/transacoes/transferir
Content-Type: application/json
Body:
{
    "numero_conta_origem": "1",
    "numero_conta_destino": "2",
    "valor": 200,
    "senha": "1234"
}

```

**Exemplo de Resposta (em caso de erro):**

```json
{
    "mensagem": "Saldo insuficiente!"
}
```

**Exemplo de Resposta (em caso de sucesso, sem conteúdo no corpo):**

```json
{}
```

**Exemplo do registro de uma transferência:**

```json
{
    "data": "2021-08-10 23:40:35",
    "numero_conta_origem": "1",
    "numero_conta_destino": "2",
    "valor": 10000
}
```

### **Saldo**

- **Método**: GET
- **Rota**: **`/contas/saldo?numero_conta=1&senha=1234`**
- **Descrição**: Retorna o saldo de uma conta bancária.

**Exemplo de Requisição:**

```
GET http://localhost:3000/contas/saldo?numero_conta=1&senha=1234
```

**Exemplo de Resposta (em caso de erro):**

```json
{
    "mensagem": "Conta bancária não encontrada!"
}
```

**Exemplo de Resposta (em caso de sucesso):**

```json
{
    "saldo": 13000
}
```

### **Extrato**

- **Método**: GET
- **Rota**: **`/contas/extrato?numero_conta=1&senha=1234`**
- **Descrição**: Lista as transações realizadas de uma conta específica.

**Exemplo de Requisição:**

```
GET http://localhost:3000/contas/extrato?numero_conta=1&senha=1234
```

**Exemplo de Resposta (em caso de erro):**

```json
{
    "mensagem": "Conta bancária não encontrada!"
}
```

**Exemplo de Resposta (em caso de sucesso):**

```json

{
  "depositos": [
    {
      "data": "2023-09-16 20:46:03",
      "numero_conta": "1",
      "valor": 10000
    },
    {
      "data": "2023-09-16 20:46:06",
      "numero_conta": "1",
      "valor": 10000
    }
  ],
  "saques": [
    {
      "data": "2023-09-16 20:46:18",
      "numero_conta": "1",
      "valor": 1000
    }
  ],
  "transferenciasEnviadas": [
    {
      "data": "2023-09-16 20:47:10",
      "numero_conta_origem": "1",
      "numero_conta_destino": "2",
      "valor": 5000
    }
  ],
  "transferenciasRecebidas": [
    {
      "data": "2023-09-16 20:47:24",
      "numero_conta_origem": "2",
      "numero_conta_destino": "1",
      "valor": 2000
    },
    {
      "data": "2023-09-16 20:47:26",
      "numero_conta_origem": "2",
      "numero_conta_destino": "1",
      "valor": 2000
    }
  ]
}
```

## **Coisas Pendentes**

Há algumas funcionalidades pendentes que planejo adicionar ao projeto:

- Verificar qual idade é permitida para criar uma conta e implementar um bloqueio com essa informação.
- Examinar bibliotecas que possam ser integradas para aprimorar o sistema.
- Avaliar quais endpoints fazem sentido exigir a senha da conta para funcionar.
- Avaliar a necessidade de criar funções adicionais para aplicar o conceito DRY (Don't Repeat Yourself) e aprimorar a estrutura do código.

## **Construído com**

- Visual Studio Code versão: 1.82.1
- Insomnia

Este projeto é um exemplo simples de um sistema bancário em JavaScript, desenvolvido no ambiente Windows. Sinta-se à vontade para contribuir e melhorar o projeto de acordo com suas necessidades.