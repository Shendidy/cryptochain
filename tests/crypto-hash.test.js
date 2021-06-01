const cryptoHash = require('../src/crypto-hash');

describe('cryptoHash()', () => {
  it('generates a SHA-256 hashed output', () => {
    expect(cryptoHash('Test SHA256'))
    .toEqual('48d738cce96b59f506c1bfc6bbf04fb70cd04e245f1bcf243c8487cc335b5505')
  });

  it('produces the same hash with the same input arguments in any order', () => {
    expect(cryptoHash('one', 'two', 'three'))
    .toEqual(cryptoHash('three', 'one', 'two'));
  });
});