const express = require("express");
const router = express.Router();
const List = require("../models/List");
const checkToken = require('../utils/checkToken');

router.post('/create', checkToken, async (req, res) => {

    const {boardId, title} = req.body;
    if (!boardId || !title) {
        res.status(400).send({msg:"Argumentos inválidos."});
    }

    try {

        const list = new List({
            boardId,
            title
        });


        await list.save();

        return res.status(201).send({ msg: "Lista criada com sucesso!"});
    } catch (err) {
        console.error("Erro ao criar lista:", err);
        return res.status(500).send({ msg:err});
    }
});

router.get('/:id', async (req, res) => {
    const list = await List.findById(req.params.id).lean(); //Nota 4
    if (!list) {
        res.status(404).json({msg:"Lista não encontrada."});
    } else {
        res.status(200).json(list);
    }
});

router.put('/:id', checkToken, async (req, res) => {

    let listId = req.params.id;
    let  {title} = req.body;

    let list = await List.findById(listId);


    if (!list) {
        res.status(404).json({msg:"Lista não encontrada."})
        return;
    }

    if (!title) {
        res.status(400).json({msg: "Título vazio."});
        return;
    }

    try{
        await List.findByIdAndUpdate(listId, {title}, {new: true});
        res.status(200).json({msg: "Lista atualizada!"});
    }catch (error) {
        res.status(500).json({ msg: error });
    }

});

router.delete('/:id', checkToken, async (req, res) => {
    let list = await List.findById(req.params.id);
    if (list){
        await list.deleteOne();
        res.status(200).json({msg:"Lista removida."});
    } else {
        res.status(404).json({msg:"Lista não encontrada."})
    }
});

module.exports = router;