const express = require("express");
const router = express.Router();
const Board = require("../models/Board");
const User = require("../models/User");

router.post('/create', async (req, res) => {
   const {title, backgroundcolor, titlecolor} = req.body;

   if (!title || !backgroundcolor || !titlecolor) {
     return res.status(400).json({msg:"Argumentos inválidos."})
   }

   const board = new Board({
       title,
       backgroundcolor,
       titlecolor
   });

   try{
       await board.save();
       res.status(201).json({msg:"Quadro criado com sucesso!"});
   } catch (error) {
       res.status(500).json({ msg: error });
   }

});

router.get('/:id', async (req, res) => {
    let board = await Board.findById(req.params.id);
    if (board){
        res.json(board);
    } else {
        res.status(404).json({msg:"Quadro não encontrado."});
    }
});

router.post('/delete/:id', async (req, res) => {
    let board = await Board.findById(req.params.id);
    if (board){
        await board.remove();
        res.status(200).json({msg:"Quadro removido."});
    } else {
        res.status(404).json({msg:"Quadro não encontrado."})
    }
});

router.post('/update/:id', async (req, res) => {
    let {title, backgroundcolor, titlecolor} = req.body;
    let id = req.params.id;

    let board = await Board.findById(id);

    if (!board){
        res.status(404).json({msg: "Quadro não encontrado."});
    } else {

        if (!title){
            title = board.title;
        }

        if (!backgroundcolor){
            backgroundcolor = board.backgroundColor;
        }

        if (!titlecolor){
            titlecolor = board.fontColor;
        }

        try{
            await Board.findByIdAndUpdate(id, {title: title, backgroundColor: backgroundcolor, fontColor: titlecolor}, {new: true});
            res.status(200).json({msg:"Quadro atualizado!"});
        } catch (error) {
            res.status(500).json({ msg: error });
        }
    }

});

module.exports = router;