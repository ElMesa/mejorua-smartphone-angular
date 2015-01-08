'use strict';

describe('Service: IssueDAO', function () {

  // load the service's module
  beforeEach(module('mejoruaSmartphoneAngularApp'));

  // instantiate service
  var IssueDAO;
  beforeEach(inject(function (_IssueDAO_) {
    IssueDAO = _IssueDAO_;
  }));

  it('should do something', function () {
    expect(!!IssueDAO).toBe(true);
  });

});
