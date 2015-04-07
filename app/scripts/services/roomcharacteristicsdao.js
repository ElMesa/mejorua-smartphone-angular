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
    .service('RoomCharacteristicsDAO', ['$q', 'UAPI', 'UGE' ,function($q, UAPI, UGE) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var self;
        this.table = {};
        this.types;
        this.room;
        this.UGE;
        this.datasetId;
        this.initRoomCharacteristicsPromise;

        this.init = function init() {
        	console.log('RoomCharacteristicsDAO.init()');
            self = this;

            var initDoneDeferred;

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
        	
        	console.log('RoomCharacteristicsDAO.parse_RoomCharacteristicsArray(RoomCharacteristicsArray:%O)', RoomCharacteristicsArray);
        	//Example code from RoomElementsDAO.import_UAPI_RoomElements()
        	/*
            var elementTypes = {};
            var elementTypeId;
            var elementTypeDescription_es;
            var elementTypeDescription_ca;
            var elementTypeDescription_en;
            var elementId;
            var elementDescription_es;
            var elementDescription_ca;
            var elementDescription_en;
            var elementObservations;
            var roomUGEId;
            var roomSIGUAId;
            var subtype;

            this.room = this.room || {};

            for (var i = 0; i < UAPI_RoomElementsArray.length; i++) {
                //Get data (Table2Object mapping)
                elementTypeId = UAPI_RoomElementsArray[i].ID_TIPELEMENTO;
                elementTypeDescription_ca = UAPI_RoomElementsArray[i].TPE_DESID1;
                elementTypeDescription_es = UAPI_RoomElementsArray[i].TPE_DESID2;
                elementTypeDescription_en = UAPI_RoomElementsArray[i].TPE_DESID3;
                elementId = UAPI_RoomElementsArray[i].ID_ELEMENTO;
                elementDescription_ca = UAPI_RoomElementsArray[i].ELE_DESID1;
                elementDescription_es = UAPI_RoomElementsArray[i].ELE_DESID2;
                elementDescription_en = UAPI_RoomElementsArray[i].ELE_DESID3;
                elementObservations = UAPI_RoomElementsArray[i].OBSELE;
                roomUGEId = UAPI_RoomElementsArray[i].AUL_CODNUM;

                //Sintetize object
                elementTypes[elementTypeId] = elementTypes[elementTypeId] || {};
                elementTypes[elementTypeId].id = elementTypeId;
                elementTypes[elementTypeId].description = {
                    es: elementTypeDescription_es,
                    ca: elementTypeDescription_ca,
                    en: elementTypeDescription_en
                }

                subtype = {
                    id: elementId,
                    typeId: elementTypeId,
                    description: {
                        es: elementDescription_es,
                        ca: elementDescription_ca,
                        en: elementDescription_en
                    },
                    observations: elementObservations
                }

                elementTypes[elementTypeId].subtype = elementTypes[elementTypeId].subtype || {};
                elementTypes[elementTypeId].subtype[elementId] = subtype;

                //Room elements index generation
                roomSIGUAId = this.UGE.UGERoomId2SIGUARoomId[roomUGEId];
                this.room[roomSIGUAId] = this.room[roomSIGUAId] || {};
                this.room[roomSIGUAId].elements = this.room[roomSIGUAId].elements || [];
                this.room[roomSIGUAId].elements.push({
                    typeId: elementTypeId,
                    id: elementId
                });
				
            }

            this.types = elementTypes;

            deferred.resolve('done');

            return deferred;
            */
        }

        this.init();
    }]);