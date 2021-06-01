const INITIAL_DIFFICULTY = 3;
const MINE_RATE = 1000;
const MINE_RATE_WINDOW = MINE_RATE / 10;

const GENESIS_DATA = {
  timestamp: 1,
  lastHash: 'genesis last hash',
  hash: 'genesis hash',
  data: [],
  nonce: 0,
  difficulty: INITIAL_DIFFICULTY
};

module.exports = {GENESIS_DATA, INITIAL_DIFFICULTY, MINE_RATE, MINE_RATE_WINDOW};