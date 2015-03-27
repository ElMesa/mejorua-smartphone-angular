'use strict';

describe('Service: RoomElementsDAO', function () {

  // load the service's module
  beforeEach(module('mejoruaSmartphoneAngularApp'));

  // instantiate service
  var RoomElementsDAO;
  beforeEach(inject(function (_RoomElementsDAO_) {
    RoomElementsDAO = _RoomElementsDAO_;
  }));

  it('should do something', function () {
    expect(!!RoomElementsDAO).toBe(true);
  });

});
