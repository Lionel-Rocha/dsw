const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const checkToken = require('../utils/checkToken');
const getUserBoards = require('../utils/getBoards');

const router = express.Router();

router.post('/auth/register', async (req, res) => {
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
        return res.status(422).json({ msg: "A senha e a confirmação precisam ser iguais!" });
    }

    const userExists = await User.findOne({ email: email });

    if (userExists) {
        return res.status(422).json({ msg: "Por favor, utilize outro e-mail!" });
    }

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

router.post('/auth/login', async (req, res) => {
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


router.put('/changePassword', checkToken, async (req, res) => {
    let {currpass, newpass} = req.body;

    try {
        let userId = req.user;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado." });
        }

        const passwordMatch = await bcrypt.compare(currpass, user.password);
        if (!passwordMatch) {
            return res.status(422).json({ msg: "A senha antiga é inválida." });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedNewPassword = await bcrypt.hash(newpass, salt);

        await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

        res.status(200).json({ msg: "Senha atualizada com sucesso!" });
    } catch (err) {
        console.error("Erro na atualização de senha:", err);
        res.status(500).json({ msg: "Houve um erro na atualização da senha." });
    }
});

router.get('/boards', checkToken, async (req, res) => {
    const userId = req.user;

    try {
        let userBoards = await getUserBoards(userId);
        res.status(200).json(userBoards);
    } catch (error) {
        res.status(500).json({ msg: error });
    }

});


module.exports = router;
