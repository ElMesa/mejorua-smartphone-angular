'use strict';

/**
 * @ngdoc service
 * @name mejoruaSmartphoneAngularApp.UGE
 * @description
 * # UGE
 * UGE stands for University of Alicante "Unidad de Gestion de Espacios" (Space/Locations managing unit)
 *
 * It haves a mapping of room ids between SIGUA id's and its own id's
 *
 * This services holds this mappings for interoprability between different dataset
 *
 * @param {$q.defer().promise} initDonePromise Promise for the init process. Used in every getter/setter.
 * @param {int} datasetId UAPI dataset it for UGE Room data
 * @param {HashMap<String,String>} UGERoomId2SIGUARoomId Mapping from UGE room id to SIGUA room id
 * @param {HashMap<String,String>} SIGUARoomId2UGERoomId Mapping from SIGUA room id to UGE room id
 *
 * @see  http://datos.ua.es/es/ficha-datos.html?idDataset=784 Dataset with mapping bwetween SIGUA and UGE id's
 */
angular.module('mejoruaSmartphoneAngularApp')
    .service('UGE', ['$q', 'UAPI', function($q, UAPI) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var self;
        this.initDonePromise;
       	this.datasetId;
       	this.UGERoomId2SIGUARoomId;
       	this.SIGUARoomId2UGERoomId;

        this.init = function init() {
			console.log('UGE.init()');
        	self = this;

            var deferred;
            var UAPIPromise;

            deferred = $q.defer();
            self.initDonePromise = deferred.promise;

            self.datasetId = UAPI.datasetId.roomUGEData;

            UAPIPromise = UAPI.getDataset(self.datasetId, 'data');
            UAPIPromise.success(function(data, status, headers, config) {
                self.parse_RoomDataArray(data, deferred);
            });
            UAPIPromise.error(function(data, status, headers, config) {
                console.log('UGE.init() -> Fetch UAPI.datasetId.roomUGEData DATA - ERROR - data:%O, status:%O, headers:%O, config:%O', data, status, headers, config);
                deferred.reject('UGE.init() -> Fetch UAPI.datasetId.roomUGEData DATA - ERROR');
            });

            return deferred.promise;
        }

        this.parse_RoomDataArray = function parse_RoomDataArray(UGERoomArray, deferred) {
            var UGERoomData;

            self.UGE = {};
            self.UGERoomId2SIGUARoomId = {};
            self.SIGUARoomId2UGERoomId = {};

            for(var i = 0; i < UGERoomArray.length; i++) {
                UGERoomData = UGERoomArray[i];

                self.UGERoomId2SIGUARoomId[UGERoomData.AUL_CODNUM] = UGERoomData.ID_SIGUA;
                self.SIGUARoomId2UGERoomId[UGERoomData.ID_SIGUA] = UGERoomData.AUL_CODNUM;
            }

            deferred.resolve(self);

            return deferred;
        }

        this.init();
    }]);
