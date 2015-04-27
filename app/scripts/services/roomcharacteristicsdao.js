'use strict';

/**
 * @ngdoc service
 * @name mejoruaSmartphoneAngularApp.RoomCharacteristicsDAO
 * @description
 * # RoomCharacteristicsDAO
 * Service in the mejoruaSmartphoneAngularApp.
 *
 * @param {$q.defer().promise} initDonePromise Promise for the init process. Used in every getter/setter.
 */
angular.module('mejoruaSmartphoneAngularApp')
    .service('RoomCharacteristicsDAO', ['$q', 'UAPI', 'UGE', function($q, UAPI, UGE) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var self;
        this.API_ISSUETARGETTO_TYPE;
        this.characteristics;
        this.room;
        this.datasetId;
        this.initDonePromise;

        this.init = function init() {
            console.log('RoomCharacteristicsDAO.init()');
            self = this;

            var initDoneDeferred;

            this.API_ISSUETARGETTO_TYPE = 'CHARACTERISTIC';

            initDoneDeferred = $q.defer();
            self.initDonePromise = initDoneDeferred.promise;

            this.datasetId = UAPI.datasetId.roomCharacteristics;

            //Once room id's mapping are ready, continue init
            UGE.initDonePromise.then(function() {
                self.initRoomCharacteristics(initDoneDeferred);
            });

            return initDoneDeferred.promise;
        }

        this.initRoomCharacteristics = function initRoomCharacteristics(deferred) {
            var promiseFetchData;

            promiseFetchData = UAPI.getDataset(self.datasetId, 'data');
            promiseFetchData.success(function(data, status, headers, config) {
                self.parse_RoomCharacteristicsArray(data, deferred);
            });
            promiseFetchData.error(function(data, status, headers, config) {
                console.log('RoomCharacteristicsDAO.init() -> initRoomCharacteristics() - Fetch UAPI.datasetId.roomCharacteristics DATA - ERROR - data:%O, status:%O, headers:%O, config:%O', data, status, headers, config);
                initRoomElementsDeferred.reject('RoomCharacteristicsDAO.init() -> initRoomCharacteristics() - Fetch UAPI.datasetId.roomCharacteristics DATA - ERROR');
            });

            return deferred.promise;
        }

        this.parse_RoomCharacteristicsArray = function parse_RoomCharacteristicsArray(RoomCharacteristicsArray, deferred) {
            var characteristics = {}; //{Hshmap<String,{UGECharacteristic}>} Index of characteristics by it's id
            var newCharacteristic;
            var roomSIGUAId;
            var roomUGEId;
            var characteristicId;
            var characteristicDescription_es;
            var characteristicDescription_ca;
            var characteristicDescription_en;
            var characteristicCuantity;
            var roomHasCharacteristic;

            self.room = self.room || {};

            for (var i = 0; i < RoomCharacteristicsArray.length; i++) {
                //Get data (Table2Object mapping)
	            characteristicId = RoomCharacteristicsArray[i].TPC_CODNUM;
	            characteristicDescription_ca = RoomCharacteristicsArray[i].TPC_DESID1;
	            characteristicDescription_es = RoomCharacteristicsArray[i].TPC_DESID2;
	            characteristicDescription_en = RoomCharacteristicsArray[i].TPC_DESID3;

	            characteristicCuantity = RoomCharacteristicsArray[i].ID_TIPELEMENTO;
	            roomUGEId = RoomCharacteristicsArray[i].AUL_CODNUM;
	            roomHasCharacteristic = RoomCharacteristicsArray[i].ID_TIPELEMENTO;

                //Sintetize object
                characteristics[characteristicId] = characteristics[characteristicId] || {};
                characteristics[characteristicId].type = this.API_ISSUETARGETTO_TYPE;
                characteristics[characteristicId].id = characteristicId;
                characteristics[characteristicId].description = {
                    es: characteristicDescription_es,
                    ca: characteristicDescription_ca,
                    en: characteristicDescription_en
                }

                //Room elements index generation
                roomSIGUAId = UGE.UGERoomId2SIGUARoomId[roomUGEId];
                self.room[roomSIGUAId] = self.room[roomSIGUAId] || {};
                self.room[roomSIGUAId].characteristics = self.room[roomSIGUAId].elements || [];
                self.room[roomSIGUAId].characteristics.push({
                    id: characteristicId
                });

            }

            self.characteristics = characteristics;
            console.log('RoomCharacteristicsDAO.parse_RoomCharacteristicsArray(RoomCharacteristicsArray:%O) - self.characteristic:%O', RoomCharacteristicsArray, self.characteristics);
            console.log('RoomCharacteristicsDAO.parse_RoomCharacteristicsArray(RoomCharacteristicsArray:%O) - self.room:%O', RoomCharacteristicsArray, self.room);

            deferred.resolve(self);

            return deferred;
        }

        this.getBySIGUARoomId = function getBySIGUARoomId(roomSIGUAId) {
            var deferred = $q.defer();
            var characteristics;

            self.initDonePromise.then(function() {
                if(self.room && self.room[roomSIGUAId]) {
                    characteristics = self.room[roomSIGUAId].characteristics;
                    deferred.resolve(characteristics);
                } else {
                    deferred.reject('Could nor retrieve characteristics');
                }
            });
            
            return deferred.promise;
        }

        this.getRooms = function getRooms() {
            var deferred = $q.defer();

            self.initDonePromise.then(function () {
                deferred.resolve(self.room);
            });

            return deferred.promise;
        }

        this.init();
    }]);