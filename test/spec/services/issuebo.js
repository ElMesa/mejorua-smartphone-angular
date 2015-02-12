'use strict';

describe('Service: IssueBO', function () {

  // load the service's module
  beforeEach(module('mejoruaSmartphoneAngularApp'));

  // instantiate service
  var IssueBO;
  beforeEach(inject(function (_IssueBO_) {
    IssueBO = _IssueBO_;
  }));

  it('should do something', function () {
    expect(!!IssueBO).toBe(true);
  });

});
