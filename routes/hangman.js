const express = require('express');
const router = express.Router();

const hangman = require('../models/hangman');

router.get("/", function(req,res){
  // let keyboard = keys[0].concat(keys[1]).concat(keys[2]);
  if(!req.session.word){
    let word = hangman.words[Math.floor(Math.random()*hangman.words.length)];
    word = word.toUpperCase();
    word = processWord(word);
    req.session.word = word;
    req.session.guesses = 8;
  }
  if(!req.session.audio){
    req.session.audio = false;
  }
  res.render("index", {
    keys: hangman.keys,
    word: req.session.word,
    guesses: req.session.guesses,
    audio: req.session.audio,
    css: hangman.css
  });
});

router.post("/keypressed", function(req, res){
  let keyID = req.body.key;
  if(keyID < 10){
    //find the key in row 1
    hangman.keys.row1[keyID].guessed = true;
    if(!hangman.isMatch(hangman.keys.row1[keyID], req.session.word)){
      req.session.guesses--;
    }
    hangman.checkGame(req.session.word, req.session.guesses, res)();
  }
  else if(keyID < 19){
    //find th ekey in row 2
    hangman.keys.row2[keyID-10].guessed = true;
    if(!hangman.isMatch(hangman.keys.row2[keyID-10], req.session.word)){
      req.session.guesses--;
    }
    hangman.checkGame(req.session.word, req.session.guesses, res)();
  }
  else{
    //find the key in row 3
    hangman.keys.row3[keyID-19].guessed = true;
    if(!hangman.isMatch(hangman.keys.row3[keyID-19], req.session.word)){
      req.session.guesses--;
    }
    hangman.checkGame(req.session.word, req.session.guesses, res)();
  }
  // res.redirect("/game");
})

module.exports = router;
