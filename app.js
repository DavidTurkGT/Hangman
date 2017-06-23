const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');

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

let keys = {
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

app.get("/", function(req, res){
  // let keyboard = keys[0].concat(keys[1]).concat(keys[2]);
  res.render("index", {keys: keys});
});

app.post("/keypressed", function(req, res){
  console.log("body received: ", req.body);
  res.redirect("/");
})

app.listen(3000, function(){
  console.log("App running on localhost:3000")
});
