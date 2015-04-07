'use strict';

describe('Service: UAPI', function () {

  // load the service's module
  beforeEach(module('mejoruaSmartphoneAngularApp'));

  // instantiate service
  var UAPI;
  beforeEach(inject(function (_UAPI_) {
    UAPI = _UAPI_;
  }));

  it('should do something', function () {
    expect(!!UAPI).toBe(true);
  });

});
