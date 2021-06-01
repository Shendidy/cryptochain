const express = require('express');
const Blockchain = require('../src/blockchain');

const app = express();
const blockchain = new Blockchain();

for(let i = 0; i<50; i++)
  blockchain.addBlock({data: `new data: ${i}`});

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening at port: ${PORT}`);
});