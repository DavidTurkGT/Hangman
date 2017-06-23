const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('public'));

app.engine('mustache', mustacheExpress());
app.set('views','./views');
app.set('view engine','mustache');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
  secret: 'cornbread',
  resave: false,
  saveUninitialized: false
}));

const keys = {
  row1: [
  {keyvalue: 'Q', guessed: false, id: 0},
  {keyvalue: 'W', guessed: false, id: 1},
  {keyvalue: 'E', guessed: false, id: 2},
  {keyvalue: 'R', guessed: false, id: 3},
  {keyvalue: 'T', guessed: false, id: 4},
  {keyvalue: 'Y', guessed: false, id: 5},
  {keyvalue: 'U', guessed: false, id: 6},
  {keyvalue: 'I', guessed: false, id: 7},
  {keyvalue: 'O', guessed: false, id: 8},
  {keyvalue: 'P', guessed: false, id: 9},
  ],
  row2: [
  {keyvalue: 'A', guessed: false, id: 10},
  {keyvalue: 'S', guessed: false, id: 11},
  {keyvalue: 'D', guessed: false, id: 12},
  {keyvalue: 'F', guessed: false, id: 13},
  {keyvalue: 'G', guessed: false, id: 14},
  {keyvalue: 'H', guessed: false, id: 15},
  {keyvalue: 'J', guessed: false, id: 16},
  {keyvalue: 'K', guessed: false, id: 17},
  {keyvalue: 'L', guessed: false, id: 18},
  ],
  row3: [
  {keyvalue: 'Z', guessed: false, id: 19},
  {keyvalue: 'X', guessed: false, id: 20},
  {keyvalue: 'C', guessed: false, id: 21},
  {keyvalue: 'V', guessed: false, id: 22},
  {keyvalue: 'B', guessed: false, id: 23},
  {keyvalue: 'N', guessed: false, id: 24},
  {keyvalue: 'M', guessed: false, id: 25},
  ]
};

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

app.get("/", function(req, res){
  res.redirect('/setup');
});

app.get("/setup", function(req, res){
  res.render("hangman");
});

app.post("/setup", function(req, res){
  let choice = req.body.button;
  let lowerLimit = 0;
  let upperLimit = 30;
  switch (choice){
    case "easy":
      console.log("You chose easy mode!");
      lowerLimit = 4;
      upperLimit = 6;
      break;
    case "medium":
      console.log("You chose medium mode!");
      lowerLimit = 7;
      upperLimit = 9;
      break;
    case "hard":
      console.log("You chose hard mode!");
      lowerLimit = 10;
      upperLimit = 12;
      break;
    case "nightmare":
      console.log("You chose nightmare mode!");
      lowerLimit = 13;
      upperLimit = 15;
      break;
    case "torture":
      console.log("You chose torture mode!");
      lowerLimit = 16;
      upperLimit = 100;
      break;
    default:
      console.log("Error, choosing random word...");
      break;
  }

  let found = false;
  do{
    let word = words[Math.floor(Math.random()*words.length)];
    if(word.length >= lowerLimit && word.length <= upperLimit){
      req.session.word = word;
      found = true;
      word = word.toUpperCase();
      console.log("Word chosen: ", word);
      word = processWord(word);
      req.session.word = word;
      console.log("Word processed: ", req.session.word);
      req.session.guesses = 8;
    }
  }while(!found);
  console.log("Word sent: ", req.session.word);
  res.redirect("/game");
});

app.get("/game", function(req,res){
  // let keyboard = keys[0].concat(keys[1]).concat(keys[2]);
  if(!req.session.word){
    let word = words[Math.floor(Math.random()*words.length)];
    word = word.toUpperCase();
    console.log("Word chosen: ", word);
    word = processWord(word);
    req.session.word = word;
    console.log("Word processed: ", req.session.word);
    req.session.guesses = 8;
  }
  res.render("index", {
    keys: keys,
    word: req.session.word,
    guesses: req.session.guesses
  });
});

app.post("/keypressed", function(req, res){
  console.log("body received: ", req.body);
  let keyID = req.body.key;
  if(keyID < 10){
    //find the key in row 1
    keys.row1[keyID].guessed = true;
    if(!isMatch(keys.row1[keyID], req.session.word)){
      req.session.guesses--;
    }
    checkGame(req.session.word, req.session.guesses, res)();
  }
  else if(keyID < 19){
    //find th ekey in row 2
    keys.row2[keyID-10].guessed = true;
    if(!isMatch(keys.row2[keyID-10], req.session.word)){
      req.session.guesses--;
    }
    checkGame(req.session.word, req.session.guesses, res)();
  }
  else{
    //find the key in row 3
    keys.row3[keyID-19].guessed = true;
    if(!isMatch(keys.row3[keyID-19], req.session.word)){
      req.session.guesses--;
    }
    checkGame(req.session.word, req.session.guesses, res)();
  }
  // res.redirect("/game");
})

app.get("/win", function(req, res){
  res.render("endgame", {win: true, word: req.session.word})
});

app.get("/lose", function(req, res){
  res.render("endgame", {win: false, word: req.session.word})
});

app.post("/endgame", function(req, res){
  console.log("Body received: ", req.body);
  if(parseInt(req.body.winnerscircle)){
    res.redirect('/winnerscircle');
  }
  else if(parseInt(req.body.playagain)){
    console.log("Playing again...");
    req.session.destroy(function(err){
      console.error(err);
    });
    resetGame();
    console.log("Destroyed session?", req.session);
    res.redirect("/");
  }
  else {
    res.redirect("/end")
  }
});

app.get("/end", function(req, res){
  res.send("Thanks for playing!")
});

app.get("/winnerscircle", function(req, res){
  res.send("Welcome to the winners circle!");
});

app.listen(3000, function(){
  console.log("App running on localhost:3000")
});

function processWord(word){
  let wordArr = word.split("");
  // console.log("Word arr: ", wordArr);
  word= [];
  for(let i = 0; i < wordArr.length; i++){
    // console.log("Processing letter: ",wordArr[i]);
    let letter = {
      value: wordArr[i],
      guessed: false,
      display: '_'
    };
    // console.log("Letter created: ", letter);
    word.push(letter);
    // console.log("New word array: ", word);
  }
  return word;
}

function isMatch(key, word){
  let letter = key.keyvalue;
  let match = false;
  for(let i = 0; i < word.length; i++){
    if(letter === word[i].value && !word[i].guessed){
      word[i].guessed = true;
      word[i].display = word[i].value;
      match = true;
    }
  }
  return match;
}

function checkGame(word, guesses, res){
  if(wordGuessed(word)){
    return (function(){ res.redirect("/win")});
  }
  else if(guesses === 0){
    return (function(){ res.redirect("lose")});
  }
  else{
    return (function(){ res.redirect("/game")});
  }
}

function wordGuessed(word){
  console.log("Word received: ", word);
  let guessed = true;
  for(let i = 0; i < word.length; i++){
    guessed &= word[i].guessed;
  }
  return guessed;
}

function resetGame(){
  //Reset keys on row1
  for(let i = 0; i < keys.row1.length; i++){
    keys.row1[i].guessed = false;
  }
  //Reset keys on row2
  for(let i = 0; i < keys.row2.length; i++){
    keys.row2[i].guessed = false;
  }
  //Reset keys on row3
  for(let i = 0; i < keys.row3.length; i++){
    keys.row3[i].guessed = false;
  }
}
