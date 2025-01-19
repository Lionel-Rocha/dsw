const express = require("express");
const router = express.Router();
const Card = require("../models/Card");
const List = require("../models/List");
const checkToken = require("../utils/checkToken");
const dbconnection = require("../utils/dbconnection.js")

router.post("/create", checkToken, async (req, res) => {
    const { listId, title, description, file } = req.body;

    // Valida se os parâmetros obrigatórios foram fornecidos
    if (!title || !listId) {
        return res.status(400).json({ msg: "Argumentos inválidos!" });
    }

    // Verifica se a lista existe
    let list;
    try {
        list = await List.findById(listId).lean();
        if (!list) {
            return res.status(404).json({ msg: "Lista não encontrada." });
        }
    } catch (err) {
        return res.status(500).json({ msg: "Erro ao buscar a lista", error: err.message });
    }

    let date = Date.now();
    let fileDocument = null;

    // Faz o upload do arquivo, se fornecido
    if (file) {
        try {
            fileDocument = await dbconnection.uploadFile(file);
            if (!fileDocument) {
                return res.status(500).json({ msg: "Erro ao fazer upload do arquivo." });
            }
        } catch (err) {
            console.error("Erro ao carregar o arquivo:", err);
            return res.status(500).json({ msg: "Erro ao carregar o arquivo." });
        }
    }


    // Criação do novo cartão
    const card = new Card({
        list,
        title,
        description,
        file: fileDocument ? fileDocument.id : null, // Salva o _id do arquivo, se houver
        date,
    });

    // Salva o cartão no banco de dados
    try {
        await card.save();
        res.status(201).json({ msg: "Cartão criado com sucesso!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Erro ao criar o cartão", error: err.message });
    }
});

router.get("/:id", checkToken, async (req, res) => {
    let cardId = req.params.id;
    let card = await Card.findById(cardId);

    if (!card) {
        res.status(404).json({msg:"Cartão não encontrado!"});
    } else {
        let filename = "provisório";
        // let filename = await dbconnection.getFileNameById(card.file);
        res.status(200).json({card, filename});
    }

});

router.get('/download/:id', checkToken, async (req, res) => {
    let cardId = req.params.id;
    let card = await Card.findById(cardId);
    const fileId = card.file;
    dbconnection.downloadFile(fileId, res);
})


router.put("/:id", checkToken, async (req, res) => {
    let {title, description, file} = req.body;
    let cardId = req.params.id;

    let card = await Card.findById(cardId);

    if (!card) {
        res.status(404).json({msg: "Cartão não encontrado!"});
    }

    if (!title){
        title = card.title;
    }
    if (!description){
        description = card.description;
    }
    if (!file){
        file = card.file;
    } else {
        file = dbconnection.uploadFile(file);
        file = file.id;
    }


    try{
        await Card.findByIdAndUpdate(cardId, {title, description, file, lastModified: Date.now()}, {new: true})
        res.status(200).json({msg: "Cartão atualizado!"});
    } catch (error) {
        res.status(500).json({msg: error});
    }

});

router.delete("/:id", checkToken, async (req, res) => {
    let cardId = req.params.id;

    let card = await Card.findById(cardId);

    if (!card) {
        res.status(404).json({msg: "Cartão não encontrado!"});
    } else {
        await card.deleteOne();
        res.status(200).json({msg: "Cartão removido."})
    }

});

module.exports = router;