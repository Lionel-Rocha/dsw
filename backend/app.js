const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require('cors');
const path = require("path");
const User = require(path.join(__dirname, "models/User.js"));

require('dotenv').config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

const app = express();
app.use(express.json(), cors())

app.get("/", (req, res) => {
    res.status(200).json({ msg: "Bem vindo a API!" });
});

app.post("/auth/register", async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;

    if (!name) {
        return res.status(422).json({ msg: "O nome de usuário é obrigatório!" });
    }

    if (!email) {
        return res.status(422).json({ msg: "O email é obrigatório!" });
    }

    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória!" });
    }

    if (password !== confirmpassword) {
        return res
            .status(422)
            .json({ msg: "A senha e a confirmação precisam ser iguais!" });
    }

    const userExists = await User.findOne({ email: email });

    if (userExists) {
        return res.status(422).json({ msg: "Por favor, utilize outro e-mail!" });
    }

    //Ver: nota 3
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);


    const user = new User({
        name,
        email,
        password: passwordHash,
    });

    try {
        await user.save();

        res.status(201).json({ msg: "Usuário criado com sucesso!" });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
});

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(422).json({ msg: "O email é obrigatório!" });
    }

    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória!" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return res.status(422).json({ msg: "Senha inválida" });
    }

    try {
        const secret = process.env.SECRET;

        const token = jwt.sign(
            {
                id: user._id,
            },
            secret
        );

        res.status(200).json({ msg: "Autenticação realizada com sucesso!", token });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
});

app.get("/user/:id", checkToken, async (req, res) => {
    const id = req.params.id;

    // check if user exists
    const user = await User.findById(id, "-password");

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    res.status(200).json({ user });
});

function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ msg: "Acesso negado!" });

    try {
        const secret = process.env.SECRET;

        jwt.verify(token, secret);

        next();
    } catch (err) {
        res.status(400).json({ msg: "O Token é inválido!" });
    }
}


//Ver: nota 2
const connectionString = `mongodb://${dbHost}:${dbPort}/${dbName}`;

//Ver: nota 1
mongoose
    .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        auth: dbUser && dbPassword ? { username: dbUser, password: dbPassword } : undefined
    })
    .then(() => {
        console.log('Conectado ao MongoDB local!');
        app.listen(3000, () => {
            console.log('Servidor rodando na porta 3000');
        });
    })
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));
