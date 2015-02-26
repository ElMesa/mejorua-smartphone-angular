'use strict';

describe('Service: ObserverService', function () {

  // load the service's module
  beforeEach(module('mejoruaSmartphoneAngularApp'));

  // instantiate service
  var ObserverService;
  beforeEach(inject(function (_ObserverService_) {
    ObserverService = _ObserverService_;
  }));

  it('should do something', function () {
    expect(!!ObserverService).toBe(true);
  });

});
