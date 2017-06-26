const express = require('express');
const router = express.Router();

const hangman = require('../models/hangman');

router.get("/win", function(req, res){
  res.render("endgame", {win: true, word: req.session.word})
});

router.get("/lose", function(req, res){
  res.render("endgame", {win: false, word: req.session.word})
});

router.post("/", function(req, res){
  if(parseInt(req.body.winnerscircle)){
    res.redirect('/winnerscircle');
  }
  else if(parseInt(req.body.playagain)){
    req.session.destroy(function(err){
      console.error(err);
    });
    hangman.resetGame();
    res.redirect("/");
  }
  else {
    res.redirect("/endgame/end")
  }
});

router.get("/end", function(req, res){
  hangman.resetGame();
  res.send("Thanks for playing!")
});

router.get("/winnerscircle", function(req, res){
  res.send("Welcome to the winners circle!");
});

module.exports = router;
