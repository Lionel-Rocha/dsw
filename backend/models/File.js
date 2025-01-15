const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Nome do arquivo
    data: { type: Buffer, required: true },  // Dados binários do arquivo
    contentType: { type: String },  // Tipo MIME do arquivo (ex: 'image/jpeg', 'application/pdf')
    size: { type: Number },  // Tamanho do arquivo
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);

module.exports = File;
