const express = require("express");
const router = express.Router();
const Board = require("../models/Board");
const BoardPermission = require("../models/BoardPermissions");
const checkToken = require('../utils/checkToken');

router.post('/create', checkToken, async (req, res) => {
   const {title, backgroundcolor, titlecolor} = req.body;

   if (!title || !backgroundcolor || !titlecolor) {
     return res.status(400).json({msg:"Argumentos inválidos."})
   }

    const userId = req.user;

   const board = new Board({
       title,
       backgroundcolor,
       titlecolor
   });

   const boardPermission = new BoardPermission({
       userId: userId,
       boardId: board.id,
       role: "admin"
   });

   try{
       await board.save();
       await boardPermission.save();
       res.status(201).json({msg:"Quadro criado com sucesso!"});
   } catch (error) {
       res.status(500).json({ msg: error });
   }

});

router.get('/:id', async (req, res) => {
    let board = await Board.findById(req.params.id);
    if (board){
        res.status(200).json(board);
    } else {
        res.status(404).json({msg:"Quadro não encontrado."});
    }
});

router.delete('/:id', checkToken, async (req, res) => {
    let board = await Board.findById(req.params.id);
    if (board){
        await board.deleteOne();
        res.status(200).json({msg:"Quadro removido."});
    } else {
        res.status(404).json({msg:"Quadro não encontrado."})
    }
});

router.put('/:id', checkToken, async (req, res) => {

    let {title, backgroundcolor, titlecolor} = req.body;
    let boardId = req.params.id;

    let board = await Board.findById(boardId);

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