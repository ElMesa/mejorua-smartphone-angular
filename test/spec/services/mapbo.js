'use strict';

describe('Service: MapBO', function () {

  // load the service's module
  beforeEach(module('mejoruaSmartphoneAngularApp'));

  // instantiate service
  var MapBO;
  beforeEach(inject(function (_MapBO_) {
    MapBO = _MapBO_;
  }));

  it('should do something', function () {
    expect(!!MapBO).toBe(true);
  });

});
