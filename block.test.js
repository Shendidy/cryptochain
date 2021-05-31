const Block = require('./block');
const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

describe('Block', () => {
  const timestamp = 'A time stamp';
  const lastHash = 'foo-lastHash';
  const hash = 'foo-hash';
  const data = ['blockchain', 'data'];
  const nonce = 1;
  const difficulty = 1;
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
  });
});