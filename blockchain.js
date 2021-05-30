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
}

module.exports = Blockchain;