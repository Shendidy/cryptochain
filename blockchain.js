const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }){
    var newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length-1],
      data
    });
    this.chain.push(newBlock);

    console.log('this is the blockchain: ', this.chain)
  }
}

module.exports = Blockchain;