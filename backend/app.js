const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/dbconnection');
const userRoutes = require('./routes/user');
const boardRoutes = require('./routes/board');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Conectar ao banco de dados
connectDB();

// Definir as rotas
app.use('/user', userRoutes);
app.use('/board', boardRoutes);
app.get('/', (req, res) => {
    res.status(200).json({ msg: "Bem-vindo à API!" });
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
