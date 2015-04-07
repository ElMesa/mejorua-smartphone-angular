'use strict';

describe('Service: RoomCharacteristicsDAO', function () {

  // load the service's module
  beforeEach(module('mejoruaSmartphoneAngularApp'));

  // instantiate service
  var RoomCharacteristicsDAO;
  beforeEach(inject(function (_RoomCharacteristicsDAO_) {
    RoomCharacteristicsDAO = _RoomCharacteristicsDAO_;
  }));

  it('should do something', function () {
    expect(!!RoomCharacteristicsDAO).toBe(true);
  });

});
