'use strict';

describe('Controller: IssuedetailCtrl', function () {

  // load the controller's module
  beforeEach(module('mejoruaSmartphoneAngularApp'));

  var IssuedetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IssuedetailCtrl = $controller('IssuedetailCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
