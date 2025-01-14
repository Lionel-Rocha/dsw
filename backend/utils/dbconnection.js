const mongoose = require('mongoose');

const connectDB = async () => {
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASS;
    const dbName = process.env.DB_NAME;
    const dbHost = process.env.DB_HOST;
    const dbPort = process.env.DB_PORT;

    const connectionString = "mongodb://mongo:ZIkpHRQydkKbawflzePtrdvtVDcMdVeh@autorack.proxy.rlwy.net:20662"
    // const connectionString = `mongodb://${dbHost}:${dbPort}/${dbName}`;

    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auth: dbUser && dbPassword ? { username: dbUser, password: dbPassword } : undefined
        });
        console.log('Conectado ao MongoDB!');
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
    }
};

module.exports = connectDB;
