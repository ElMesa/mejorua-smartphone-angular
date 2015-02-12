'use strict';

describe('Service: SiguaDAO', function () {

  // load the service's module
  beforeEach(module('mejoruaSmartphoneAngularApp'));

  // instantiate service
  var SiguaDAO;
  beforeEach(inject(function (_SiguaDAO_) {
    SiguaDAO = _SiguaDAO_;
  }));

  it('should do something', function () {
    expect(!!SiguaDAO).toBe(true);
  });

});
