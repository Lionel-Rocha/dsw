const express = require("express");
const router = express.Router();
const Card = require("../models/Card");
const List = require("../models/List");
const checkToken = require("../utils/checkToken");

router.post("/create", checkToken, async (req, res) => {
    const {listId, title, description, file} = req.body;

    if (!title || !listId) {
        return res.status(400).json({msg:"Argumentos inválidos!"});
    }

    let list = await List.findById(listId).lean();

    if (!list) {
        res.status(404).json({msg:"Lista não encontrada."});
    }

    let date = Date.now();

    const card = new Card({
        list,
        title,
        description,
        file,
        date,
        date
    });

    try{
        await card.save();
        res.status(201).json({msg:"Cartão criado com sucesso!"});
    } catch(err){
        console.log(err);
        res.status(500).json({msg:"Erro ao criar o cartão"});
    }
});

router.get("/:id", checkToken, async (req, res) => {
    let cardId = req.params.id;
    let card = await Card.findById(cardId);

    if (!card) {
        res.status(404).json({msg:"Cartão não encontrado!"});
    } else {
        res.status(200).json(card);
    }

});

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