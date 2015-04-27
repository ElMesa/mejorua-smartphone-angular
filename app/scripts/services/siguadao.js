'use strict';

/**
 * @ngdoc service
 * @name mejoruaSmartphoneAngularApp.SiguaDAO
 * @description
 * # SiguaDAO
 * Service in the mejoruaSmartphoneAngularApp.
 */
angular.module('mejoruaSmartphoneAngularApp')
    .service('SiguaDAO', ['$http', '$q', 'Restangular', function($http, $q, Restangular) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var self = this;

        this.room = undefined; //{HashMap<String,{SIGUA_Room}>} Rooms indexed by its id

        this.API_URL = undefined;
        this.dao = undefined;

        this.init = function init() {
            this.room = {};

            this.API_URL = 'http://www.sigua.ua.es/api/pub';

            this.dao = Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl(self.API_URL);
            });
        }

        this.roomGetById = function getById(roomId) {
            //console.log('SiguaDAO.roomGetById(roomId: %O)', roomId);  
            return this.dao.one('estancia', roomId).get();
        }

        this.roomGetByIdArray = function getById(roomIdArray) {
            //console.log('SiguaDAO.roomGetByIdArray(roomIdArray: %O)', roomIdArray);
            var deferred = $q.defer();

            var roomId;
            self.roomGetByIdArray_fetchsPending = roomIdArray.length;
            self.roomGetByIdArray_roomArray = {};

            for (var i = 0; i < roomIdArray.length; i++) {
                roomId = roomIdArray[i];

                if (self.room[roomId] == undefined) {
                    //Room not fetched yet - Needs fetch

                    self.dao.one('estancia', roomId).get().then(function(SIGUARoom) {

                        var id = SIGUARoom.features[0].properties.codigo;

                        self.roomGetByIdArray_roomArray[id] = SIGUARoom;

                        //Sync - Resolves deferred after all data is ready
                        self.roomGetByIdArray_fetchsPending--;
                        if (self.roomGetByIdArray_fetchsPending == 0) {
                            deferred.resolve(self.roomGetByIdArray_roomArray);
                        }
                    });
                } else {
                    //Room is already fetched - Using cached data.
                    self.roomGetByIdArray_roomArray[id] = self.room[roomId];

                    //Sync - Resolves deferred after all data is ready
                    self.roomGetByIdArray_fetchsPending--;
                    if (self.roomGetByIdArray_fetchsPending == 0) {
                        deferred.resolve(self.roomGetByIdArray_roomArray);
                    }
                }
            }

            return deferred.promise;
        }

        this.buildingGetById = function getById(buildingId) {
            //console.log('SiguaDAO.buildingGetById(buildingId: %O)', buildingId);    
            return this.dao.one('edificio', buildingId).get();
        }

        this.headquartersGetById = function getById(headquartersId) {
            //console.log('SiguaDAO.headquartersGetById(headquartersId: %O)', headquartersId);    
            return this.dao.one('sede', headquartersId).get();
        }

        this.idGetByFloorLatLng = function idGetByLatLng(floor, latitude, longitude) {
            var urlProxy = 'http://localhost:8080/mejorua-api/api/proxy';
            var targetURL = 'http://www.sigua.ua.es/apirest/pub/estancia/coordenada/' + floor + '/' + longitude + '/' + latitude;
            var targerURLEncoded = encodeURIComponent(targetURL);
            var url = urlProxy + '?url=' + targerURLEncoded;

            return $http.get(url);
        }

        this.init();

    }]);