'use strict';

/**
 * @ngdoc service
 * @name mejoruaSmartphoneAngularApp.SiguaDAO
 * @description
 * # SiguaDAO
 * Service in the mejoruaSmartphoneAngularApp.
 */
angular.module('mejoruaSmartphoneAngularApp')
    .service('SiguaDAO', ['Restangular', function(Restangular) {
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
            console.log('SiguaDAO.roomGetById(roomId: %O)', roomId);	
        	return this.dao.one('estancia', roomId).get();
        }

        this.buildingGetById = function getById(buildingId) {
            console.log('SiguaDAO.buildingGetById(buildingId: %O)', buildingId);    
            return this.dao.one('edificio', buildingId).get();
        }

        this.headquartersGetById = function getById(headquartersId) {
            console.log('SiguaDAO.headquartersGetById(headquartersId: %O)', headquartersId);    
            return this.dao.one('sede', headquartersId).get();
        }

        this.init();

    }]);