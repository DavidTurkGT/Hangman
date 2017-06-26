const fs = require('fs');

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

const css = {
  easy: false,
  medium: false,
  hard: false,
  nightmare: false,
  torture: false
}

function processWord(word){
  let wordArr = word.split("");
  word= [];
  for(let i = 0; i < wordArr.length; i++){
    let letter = {
      value: wordArr[i],
      guessed: false,
      display: '_'
    };
    word.push(letter);
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
    return (function(){ res.redirect("/endgame/win")});
  }
  else if(guesses === 0){
    return (function(){ res.redirect("/endgame/lose")});
  }
  else{
    return (function(){ res.redirect("/game")});
  }
}

function wordGuessed(word){
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

module.exports = {
  keys: keys,
  words: words,
  css: css,
  process: processWord,
  isMatch: isMatch,
  checkGame: checkGame,
  resetGame: resetGame
}
