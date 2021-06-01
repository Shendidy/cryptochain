const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../src/blockchain');

const app = express();
const blockchain = new Blockchain();

app.use(bodyParser.json());

for(let i = 0; i<5; i++)
  blockchain.addBlock({data: `new data: ${i}`});

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data});

  res.redirect('/api/blocks');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening at port: ${PORT}`);
});