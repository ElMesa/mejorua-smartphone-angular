'use strict';

/**
 * @ngdoc service
 * @name mejoruaSmartphoneAngularApp.SiguaDAO
 * @description
 * # SiguaDAO
 * Service in the mejoruaSmartphoneAngularApp.
 */
angular.module('mejoruaSmartphoneAngularApp')
    .service('SiguaDAO', ['Restangular', '$http', function(Restangular, $http) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var self = this;

        this.API_URL = undefined;
        this.dao = undefined;

        this.init = function init() {
        	this.API_URL = 'http://www.sigua.ua.es/api/pub';

            this.dao = Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl(self.API_URL);
            });
        }

        this.roomGetById = function getById(roomId) {
            //console.log('SiguaDAO.roomGetById(roomId: %O)', roomId);	
        	return this.dao.one('estancia', roomId).get();
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