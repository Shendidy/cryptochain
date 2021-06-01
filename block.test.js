const Block = require('./block');
const { GENESIS_DATA, INITIAL_DIFFICULTY, MINE_RATE, MINE_RATE_WINDOW } = require('./config');
const cryptoHash = require('./crypto-hash');

describe('Block', () => {
  const timestamp = 10000;
  const lastHash = 'foo-lastHash';
  const hash = 'foo-hash';
  const data = ['blockchain', 'data'];
  const nonce = 1;
  const difficulty = INITIAL_DIFFICULTY;
  const block = new Block({
    timestamp,
    data,
    lastHash,
    hash,
    nonce,
    difficulty
  });

  it('has a timestamp, lastHash, hash, and data properties', () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
  });

  describe('genesis()', () => {
    const genesisBlock = Block.genesis();

    it('returns a Block instance', () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it('returns the genesis data', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe('mineBlock()', () => {
    let logMock = jest.fn();
    global.console.log = logMock;
  
    const lastBlock = Block.genesis();
    const data = 'new data';
    const minedBlock = Block.mineBlock({lastBlock, data});

    it('returns a Block instance', () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it('sets the `data`', () => {
      expect(minedBlock.data).toEqual(data);
    });

    it('sets a `timestamp`', () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it('creates a SHA256 `hash` based on the properinputs', () => {
      expect(minedBlock.hash)
      .toEqual(
        cryptoHash(
          minedBlock.timestamp,
          data,
          lastBlock.hash,
          minedBlock.nonce,
          minedBlock.difficulty
        )
      )
    });

    it('logs about creating the new block', () => {
      expect(logMock).toHaveBeenCalled();
    });

    it('sets a `hash` that matches the difficulty criteria', () => {
      expect(minedBlock.hash.substring(0, minedBlock.difficulty))
      .toEqual('0'.repeat(minedBlock.difficulty));
    });

    it('adjusts the difficulty', () => {
      const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty - 1];

      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });
  });

  describe('adjustDifficulty()', () => {
    describe('where the mining duration is out of the MINE_RATE_WINDOW', () => {
      it('raises the difficulty for a quickly mined block', () => {
        expect(Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - MINE_RATE_WINDOW - 1
        })).toEqual(block.difficulty + 1)
      });
  
      it('lowers the difficulty for a slowly mined block', () => {
        expect(Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + MINE_RATE_WINDOW + 1
        })).toEqual(block.difficulty - 1)
      });

      it('does not go below 1', () => {
        block.difficulty = -1;

        expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1);
      });
    });

    describe('where the mining duration is within the MINE_RATE_WINDOW', () => {
      beforeEach(() => {
        block.difficulty = INITIAL_DIFFICULTY;
      });

      it('but higher than the MINE_RATE by the alowed window', () => {
        expect(Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + MINE_RATE_WINDOW
        })).toEqual(block.difficulty)
      });

      it('but lower than the MINE_RATE by the alowed window', () => {
        expect(Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - MINE_RATE_WINDOW
        })).toEqual(block.difficulty)
      });
    });
  });
});