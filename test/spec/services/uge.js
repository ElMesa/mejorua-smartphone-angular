'use strict';

describe('Service: UGE', function () {

  // load the service's module
  beforeEach(module('mejoruaSmartphoneAngularApp'));

  // instantiate service
  var UGE;
  beforeEach(inject(function (_UGE_) {
    UGE = _UGE_;
  }));

  it('should do something', function () {
    expect(!!UGE).toBe(true);
  });

});
