const Block = require('./block');

describe('Block', () => {
  const timestamp = 'A time stamp';
  const lastHash = 'foo-lastHash';
  const hash = 'foo-hash';
  const data = ['blockchain', 'data'];
  const block = new Block({
    timestamp,
    data,
    lastHash,
    hash
  });

  it('has a timestamp, lastHash, hash, and data properties', () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });
});