require('dotenv').config();
const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");

const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();
const { ROLLBAR_ACCESS_TOKEN } = process.env;

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: `${ROLLBAR_ACCESS_TOKEN}`,
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

// Set up middleware
app.use(express.static(`${__dirname}/public`));
// Or app.use(express.static('public'));
// Or app.use(express.static(path.join(__dirname,'./public')));

app.use(express.json());


//entry point for our website
app.get("/", (req,res) => {
    res.sendFile(`${__dirname}/public/index.html`)
})
// app.get('/styles', (req,res) => {
//     res.sendFile(path.join(__dirname,'./public/styles.css'))
// })
// app.get('/index', (req,res) => {
//     res.sendFile(path.join(__dirname,'./public/index.js'))
// })


// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };Hea
};

app.get("/api/robots", (req, res) => {
  try {
    rollbar.info('Someone requested all robots');
    res.status(200).send(bots);
  } catch (error) {
    rollbar.warning('Failed to display robots. ERROR!')
    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots);
    rollbar.info('Someone shuffled the robots to play with');
    res.status(200).send(shuffled);
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      rollbar.log(`Player lost ${playerRecord.losses} time(s) already`);
      res.status(200).send("You lost!");
    } else if (compHealth === playerHealth){ 
      rollbar.warning(`There has been a tie. Win is neutral`);
      res.status(200).send("It's a tie!");
    }else {
      playerRecord.wins += 1;
      res.status(200).send("You won!");
      rollbar.log(`Player won ${playerRecord.wins} time(s) already`);
    }
  } catch (error) {
    rollbar.critical('Could not duel. Failed!')
    console.log("ERROR DUELING", error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    rollbar.log(`Player record has been requested.`)
    res.status(200).send(playerRecord);
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});

app.listen(8000, () => {
  console.log(`Listening on port: 8000`);
});
