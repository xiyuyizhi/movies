var assert = require('assert');
const should =require('should')

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(0));
    });
    it('use should',()=>{
        should(10).be.exactly(10)
    })
  });
});