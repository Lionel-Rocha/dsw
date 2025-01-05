## Antes de iniciar o projeto:
1. Crie uma instância local ou cloud gratuita do MongoDB.
2. Crie um usuário admin para sua instância.
3. Popule um arquivo .env no mesmo diretório do arquivo app.js com as seguintes informações:
	1. DB_USER
	2. DB_PASS
	3. DB_NAME 	
	4. DB_HOST
	5. DB_PORT
	6.SECRET (para o token JWT)

## Observações
Nota 1:
Absolutamente necessário para garantir que a conexão com o banco de dados seja estabelecida antes da API iniciar. Senão, o back-end não consegue ter acesso aos usuários.

Nota 2:
Caso a instância do Mongo seja na nuvem, ver [esse link](https://www.mongodb.com/developer/code-examples/javascript/node-connect-mongodb-3-3-2/) que ensina a fazer a conexão.

Nota 3:
Criptografia para não armazenar a senha do usuário “limpa” no banco de dados. 
