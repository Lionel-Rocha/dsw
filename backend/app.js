const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dbconnection = require('./utils/dbconnection');
const userRoutes = require('./routes/user');
const boardRoutes = require('./routes/board');
const listRoutes = require('./routes/list');
const cardRoutes = require('./routes/card');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

dbconnection.connectDB();

app.use('/user', userRoutes);
app.use('/board', boardRoutes);
app.use('/list', listRoutes);
app.use('/card', cardRoutes);
app.get('/', (req, res) => {
    res.status(200).json({ msg: "Bem-vindo à API!" });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
