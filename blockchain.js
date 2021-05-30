const Block = require('./block');
const cryptoHash = require('./crypto-hash');

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
  }

  static isValidChain(chain){
    if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

    for(let i = 1; i < chain.length; i++)
    {
      if(chain[i].lastHash !== chain[i-1].hash)
        return false;

      if(chain[i].hash !== cryptoHash(chain[i].timestamp, chain[i].lastHash, chain[i].data))
        return false;
    }

    return true;
  }

  replaceChain(chain){
    if(chain.length <= this.chain.length) {
      console.error('The incoming chain is shorter than or equal to the existing chain!');
      return;
    }
    if(!Blockchain.isValidChain(chain)) {
      console.error('The incoming chain is not a valid chain');
      return;
    }
    
    console.log('replacing chain with: ', chain);
    this.chain = chain;
  }
}

module.exports = Blockchain;