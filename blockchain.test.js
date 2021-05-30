const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
  let blockchain, newChain, originalChain, errorMock, logMock;

  beforeEach(() => {
    errorMock = jest.fn();
    logMock = jest.fn();

    global.console.error = errorMock;
    global.console.log = logMock;
  });


  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();

    originalChain = blockchain.chain;
  });

  it('contains a `chain` Array instance', () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it('starts with the genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it('adds a new block to the chain', () => {
    const newData = 'new data';
    blockchain.addBlock({data: 'initial data'})
    blockchain.addBlock({ data: newData });

    expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
  });

  describe('isValidChain()', () => {
    describe('when the chain does not start with the genesis block', () => {
      it('returns false', () => {
        blockchain.chain[0] = {data: 'fake genesis...'};

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe('when the chain starts with the genesis block and has multiple blocks', () => {

      beforeEach(() => {
        blockchain.addBlock({data: 'new data 001'});
        blockchain.addBlock({data: 'new data 002'});
        blockchain.addBlock({data: 'new data 003'});
        blockchain.addBlock({data: 'new data 004'});
      });

      describe('and a lastHash reference has changed', () => {

        it('returns false', () => {
          blockchain.chain[2].lastHash = 'corrupted lastHash...';

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the chain contains a block with an invalid data field', () => {
        it('returns false', () => {
          blockchain.chain[2].data = 'corrupted data...';

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the chain does not contain any invalid blocks', () => {
        it('returns true', () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe('replaceChain()', () => {
    describe('when the new chain is not longer than the existing old chain', () => {
      beforeEach(() => {
        newChain.chain[0] = { new: 'chain' };
        blockchain.replaceChain(newChain.chain);
      });
      it('does not replace the chain', () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it('logs an error', () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe('when the new chain is longer than the existing old chain', () => {
      beforeEach(() => {
        newChain.addBlock({data: 'new data 001'});
        newChain.addBlock({data: 'new data 002'});
        newChain.addBlock({data: 'new data 003'});
        newChain.addBlock({data: 'new data 004'});
      });

      describe('and the new chain is invalid', () => {
        beforeEach(() => {
          newChain.chain[2].hash = 'some-fake-hash';
          blockchain.replaceChain(newChain.chain);
        }),

        it('does not replace the chain', () => {
          expect(blockchain.chain).toEqual(originalChain)
        });

        it('logs an error', () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe('and the new chain is valid', () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        });
        it('replaces the chain', () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });

        it('logs about replacing the chain with the new one', () => {
          expect(logMock).toHaveBeenCalled();
        });
      })
    });
  });
});