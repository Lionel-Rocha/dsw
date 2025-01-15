const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/dbconnection');
const userRoutes = require('./routes/user');
const boardRoutes = require('./routes/board');
const listRoutes = require('./routes/list');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use('/user', userRoutes);
app.use('/board', boardRoutes);
app.use('/list', listRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ msg: "Bem-vindo à API!" });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
