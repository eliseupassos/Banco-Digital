# Projeto Bancário em JavaScript (Desenvolvido no Windows)

Este é um projeto JavaScript que implementa um sistema bancário simples. Ele permite listar contas bancárias, criar novas contas, atualizar dados de usuários, excluir contas, depositar e sacar dinheiro. Além disso, há planos para adicionar recursos adicionais, como transferências, consulta de saldo e extrato.

## Pré-requisitos

Antes de começar, certifique-se de ter todas as bibliotecas necessárias instaladas. Você pode instalá-las executando o seguinte comando no terminal:

```
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

- Método: GET
- Rota: **`/contas?senha_banco=Cubos123Bank`**
- Descrição: Lista todas as contas bancárias existentes.

**Exemplo de Requisição:**

```

GET http://localhost:3000/contas?senha_banco=Cubos123Bank

```

**Exemplo de Resposta:**

```json
// 2 contas encontradas
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

// Nenhuma conta encontrada
[]
{
    "mensagem": "A senha do banco informada é inválida!"
}

```

### **Criar conta bancária**

- Método: POST
- Rota: **`/contas`**
- Descrição: Cria uma nova conta bancária.

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
    "mensagem": "Já existe uma conta com o cpf ou e-mail informado!"
}

```

**Exemplo de Resposta (em caso de sucesso, sem conteúdo no corpo):**

```json

{}

```

### **Atualizar usuário da conta bancária**

- Método: PUT
- Rota: **`/contas/:numeroConta/usuário`**
- Descrição: Atualiza os dados do usuário de uma conta bancária.

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

- Método: DELETE
- Rota: **`/contas/:numeroConta`**
- Descrição: Exclui uma conta bancária existente.

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

- Método: POST
- Rota: **`/transacoes/depositar`**
- Descrição: Realiza um depósito em uma conta bancária.

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

- Método: POST
- Rota: **`/transacoes/sacar`**
- Descrição: Realiza um saque em uma conta bancária.

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

## **Coisas Pendentes**

Há algumas funcionalidades pendentes que planejamos adicionar ao projeto:

- **Transferir**: Este endpoint permitirá a transferência de recursos (dinheiro) de uma conta bancária para outra e registrará essa transação.
- **Saldo**: Este endpoint retornará o saldo de uma conta bancária.
- **Extrato**: Este endpoint listará as transações realizadas de uma conta específica.
- **DRY**: Planejamos criar funções para aplicar o conceito DRY (Don't Repeat Yourself) e melhorar a organização do código.

## **Construído com**

- Visual Studio Code versão: 1.82.1
- Insomnia

Este projeto é um exemplo simples de um sistema bancário em JavaScript, desenvolvido no ambiente Windows. Sinta-se à vontade para contribuir e melhorar o projeto de acordo com suas necessidades.