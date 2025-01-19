const mongoose = require('mongoose');
let bucket;

async function connectDB() {
    try {
        // Conectando ao banco de dados (ajuste a string de conexão conforme necessário)
        await mongoose.connect('mongodb://mongo:ZIkpHRQydkKbawflzePtrdvtVDcMdVeh@autorack.proxy.rlwy.net:20662', { useNewUrlParser: true, useUnifiedTopology: true });

        // Inicializando o bucket após a conexão com o banco
        bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'filesBucket', // Nome do bucket (pode ser personalizado)
        });

        console.log('Conexão com o MongoDB bem-sucedida e bucket inicializado');
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
    }
}

async function uploadFile(file) {
    if (!bucket) {
        throw new Error('Bucket não inicializado');
    }

    return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(file.name, {
            contentType: file.mimetype,  // Tipo MIME
        });

        uploadStream.end(file.buffer);  // Escreve os dados do arquivo no GridFS

        uploadStream.on('finish', () => {
            // Retorna o documento do arquivo após o upload bem-sucedido
            resolve(uploadStream);
        });

        uploadStream.on('error', (err) => {
            console.error("Erro ao fazer upload do arquivo:", err);
            reject(err);  // Rejeita a promessa se houver erro
        });
    });
}

async function getFileNameById(fileId) {
    return new Promise((resolve, reject) => {
        bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray((err, files) => {
            if (err) {
                return reject(err);
            }
            if (!files || files.length === 0) {
                return resolve(null); // Nenhum arquivo encontrado
            }
            resolve(files[0].filename); // Retorna o primeiro arquivo encontrado
        });
    });
}

const downloadFile = async (fileId, res) => {
    try {
        // Verifica se o arquivo existe no bucket
        const files = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
        if (!files || files.length === 0) {
            res.status(404).json({ msg: 'Arquivo não encontrado no bucket!' });
            return;
        }

        const file = files[0]; // Obtém o arquivo

        // Configura os cabeçalhos de resposta para download
        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', `attachment; filename="${file.filename}"`);

        // Abre o stream de download e envia o conteúdo para o cliente
        const downloadStream = bucket.openDownloadStream(file._id);
        downloadStream.pipe(res);

        // Tratamento de erros durante o stream
        downloadStream.on('error', (err) => {
            console.error('Erro durante o download do arquivo:', err);
            res.status(500).json({ msg: 'Erro ao baixar o arquivo!' });
        });

        // Finaliza a resposta quando o download for concluído
        downloadStream.on('end', () => {
            console.log(`Download do arquivo "${file.filename}" concluído!`);
        });

    } catch (err) {
        console.error('Erro ao processar o download:', err);
        res.status(500).json({ msg: 'Erro ao processar o download do arquivo!' });
    }
};


// async function uploadFile(file) {
//     return new Promise((resolve, reject) => {
//         const uploadStream = bucket.openUploadStream(file.originalname, {
//             contentType: file.mimetype,  // Tipo MIME
//         });
//
//         uploadStream.end(file.buffer);  // Escreve os dados do arquivo no GridFS
//
//         uploadStream.on('finish', () => {
//             // Retorna o documento do arquivo após o upload bem-sucedido
//             resolve(uploadStream);
//         });
//
//         uploadStream.on('error', (err) => {
//             console.error("Erro ao fazer upload do arquivo:", err);
//             reject(err);  // Rejeita a promessa se houver erro
//         });
//     });
// }
// const connectDB = async () => {
//     const dbUser = process.env.DB_USER;
//     const dbPassword = process.env.DB_PASS;
//     const dbName = process.env.DB_NAME;
//     const dbHost = process.env.DB_HOST;
//     const dbPort = process.env.DB_PORT;
//
//     const connectionString = "mongodb://mongo:ZIkpHRQydkKbawflzePtrdvtVDcMdVeh@autorack.proxy.rlwy.net:20662"
//     // const connectionString = `mongodb://${dbHost}:${dbPort}/${dbName}`;
//
//     try {
//         await mongoose.connect(connectionString, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             auth: dbUser && dbPassword ? { username: dbUser, password: dbPassword } : undefined
//         });
//         console.log('Conectado ao MongoDB!');
//
//
//         (() => {
//             mongoose.connection.on("connected", () => {
//                 bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//                     bucketName: "filesBucket",
//                 });
//             });
//         })();
//
//         module.exports.bucket = bucket;
//
//     } catch (err) {
//         console.error('Erro ao conectar ao MongoDB:', err);
//     }
//
//
// };

module.exports = {
    connectDB,
    uploadFile,
    getFileNameById,
    downloadFile
};
