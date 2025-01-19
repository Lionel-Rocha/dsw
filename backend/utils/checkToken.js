const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ msg: "Acesso negado!" });

    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret, (err, decodedToken) => {
            req.user = decodedToken.id;
        });

        next();
    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: "O Token é inválido!" });
    }
};



module.exports = checkToken;
