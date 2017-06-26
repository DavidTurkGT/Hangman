const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');

//Routers
const setupRouter = require('./routes/setup');
const gameRouter = require('./routes/hangman');
const endgameRouter = require('./routes/endgame');

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

app.use('/setup', setupRouter);
app.use('/game', gameRouter);
app.use('/endgame', endgameRouter);

app.get("/", function(req, res){
  res.redirect('/setup');
});

app.listen(3000, function(){
  console.log("App up and running on localhost:3000");
});
