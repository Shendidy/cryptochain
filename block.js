const { GENESIS_DATA, MINE_RATE, MINE_RATE_WINDOW } = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
  constructor({timestamp, lastHash, hash, data, nonce, difficulty}) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({lastBlock, data}) {
    let hash, timestamp;
    const lastHash = lastBlock.hash;
    let nonce = 0;
    let {difficulty} = lastBlock;

    console.log('Mining new block...');

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = this.adjustDifficulty({originalBlock: lastBlock, timestamp});
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    }
    while(hash.substring('0', difficulty) !== '0'.repeat(difficulty));
    
    return new this({
      timestamp,
      lastHash,
      data,
      hash,
      nonce,
      difficulty
    })
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    const  { difficulty } = originalBlock;
    let difference = timestamp - originalBlock.timestamp;

    // too fast
    if( difference < MINE_RATE - MINE_RATE_WINDOW ) return difficulty + 1;
    // too slow
    if( difference > MINE_RATE + MINE_RATE_WINDOW ) return Math.max(difficulty - 1, 1);
    // within mining rate window
    return Math.max(difficulty, 1);
  }
}

module.exports = Block;