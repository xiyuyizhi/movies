var assert = require('assert');
const should =require('should')

describe('Array', function() {
  describe('#indexOf()', function() {

    this.timeout(8000)  //全局定义一下 其下的timeout最大时间

    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(0));
    });
    it('use should',()=>{
        should(10).be.exactly(10).and.be.a.Number()
    })

    it('timeout',function(done){

     setTimeout(done,1000)
     should('123').be.a.String()

    })

  });


});