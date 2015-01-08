'use strict';

describe('Controller: IssuelistCtrl', function () {

  // load the controller's module
  beforeEach(module('mejoruaSmartphoneAngularApp'));

  var IssuelistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IssuelistCtrl = $controller('IssuelistCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
