const express = require('express');
const router = express.Router();

const hangman = require('../models/hangman');

router.get("/", function(req, res){
  res.render("hangman");
});

router.post("/", function(req, res){
  let choice = req.body.button;
  let lowerLimit = 0;
  let upperLimit = 30;
  switch (choice){
    case "easy":
      hangman.css.easy = true;
      lowerLimit = 4;
      upperLimit = 6;
      break;
    case "medium":
      hangman.css.medium = true;
      lowerLimit = 7;
      upperLimit = 9;
      break;
    case "hard":
      hangman.css.hard = true;
      lowerLimit = 10;
      upperLimit = 12;
      break;
    case "nightmare":
      hangman.css.nightmare = true;
      lowerLimit = 13;
      upperLimit = 15;
      break;
    case "torture":
      hangman.css.torture = true;
      lowerLimit = 16;
      upperLimit = 100;
      break;
    default:
      break;
  }

  let found = false;
  do{
    let word = hangman.words[Math.floor(Math.random()*hangman.words.length)];
    if(word.length >= lowerLimit && word.length <= upperLimit){
      req.session.word = word;
      found = true;
      word = word.toUpperCase();
      word = hangman.process(word);
      req.session.word = word;
      req.session.guesses = 8;
    }
  }while(!found);
  res.redirect("/game");
});

module.exports = router;
