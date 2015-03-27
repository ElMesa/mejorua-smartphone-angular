'use strict';

/**
 * @ngdoc service
 * @name mejoruaSmartphoneAngularApp.RoomElementsDAO
 * @description
 * # RoomElementsDAO
 * Service in the mejoruaSmartphoneAngularApp.
 * 
 * @property {HashMap<ElementType>} types
 * @property {ElementTypesTable} table (complete description above {ElementTypesTable} methods)
 * @param {HashMap<String,Object>} this.room Hashmap of UGE (http://sga.ua.es/es/gestion-espacios/) room id holding a ".elements" array of objects containing typeId and id of the elements present in that room
 * @param {UGERoomMapping} UGE holds mapping grom UGE_id to SIGUA_id and viceversa
 *
 * Datamodel - {ElementType}:
 * {
 *     id,
 *     description: {
 *         es,
 *         ca,
 *         en
 *     },
 *     subtypes //{HashMap<Element>}
 * }
 *
 * Datamodel - {Element}:
 * {
 *     id,
 *     typeId,
 *     description: {
 *         es,
 *         ca,
 *         en
 *     }
 * }
 *
 */
angular.module('mejoruaSmartphoneAngularApp')
    .service('RoomElementsDAO', ['$http', '$q', function($http, $q) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var self;
        this.table = {};
        this.types;
        this.room;
        this.UGE;

        this.DATASETID_ROOMELEMENTS = 805;
        this.DATASETID_ROOMUGEDATA = 784;

        //UaOpenData documentation: https://dev.datos.ua.es/apidoc-en.html
        this.UAOpenData_APIKey = 'XBfkmAYGUpAG8Yedh4WT';
        this.UAOpenData_datasetId = this.DATASETID_ROOMELEMENTS; //http://datos.ua.es/es/ficha-datos.html?idDataset=805
        this.UAOpenData_datasetMode = 'data'; //data || meta
        this.UAOpenData_datasetURL = 'https://dev.datos.ua.es/uapi/' + this.UAOpenData_APIKey + '/datasets/' + this.UAOpenData_datasetId + '/data';

        this.proxy_BaseURL = 'http://localhost:8080/mejorua-api/api/proxy';
        this.proxy_targerURLEncoded = encodeURIComponent(this.UAOpenData_datasetURL);
        this.proxy_url = this.proxy_BaseURL + '?url=' + this.proxy_targerURLEncoded;

        this.init = function init() {
            self = this;

            var initRoomElementsDeferred = $q.defer();
            self.initRoomElementsPromise = initRoomElementsDeferred.promise;

            var UGEpromise;

            UGEpromise = this.initUGE();
            
            UGEpromise.then(function (){ 
                self.initRoomElements(initRoomElementsDeferred);
            });

        }

        this.initUGE = function initUGE() {
            var UGEdeferred = $q.defer();
            var UAPIPromise;

            UAPIPromise = $http.jsonp(self.getUAOpenData_datasetURL(self.DATASETID_ROOMUGEDATA, 'data') + '?callback=JSON_CALLBACK');

            UAPIPromise.success(function(data, status, headers, config) {
                console.log('RoomElementsDAO.init() -> initUGE() - Fetch DATASET_ROOMELEMENTS DATA - SUCCESS - data:%O, status:%O, headers:%O, config:%O', data, status, headers, config);
                self.import_UGE_RoomData(data, UGEdeferred);
            });
            UAPIPromise.error(function(data, status, headers, config) {
                console.log('RoomElementsDAO.init() -> initUGE() - Fetch DATASET_ROOMELEMENTS DATA - ERROR - data:%O, status:%O, headers:%O, config:%O', data, status, headers, config);
                UGEdeferred.reject('UAPI fetch failed');
            });

            return UGEdeferred.promise;
        }

        this.initRoomElements = function initRoomElements(initRoomElementsDeferred) {
            
            var promiseFetchData;

            promiseFetchData = $http.jsonp(self.getUAOpenData_datasetURL(self.DATASETID_ROOMELEMENTS, 'data') + '?callback=JSON_CALLBACK');

            promiseFetchData.success(function(data, status, headers, config) {
                console.log('RoomElementsDAO.init() -> initRoomElements() - Fetch DATASET_ROOMELEMENTS DATA - SUCCESS - data:%O, status:%O, headers:%O, config:%O', data, status, headers, config);
                self.import_UAPI_RoomElements(data, initRoomElementsDeferred);
            });
            promiseFetchData.error(function(data, status, headers, config) {
                console.log('RoomElementsDAO.init() -> initRoomElements() - Fetch DATASET_ROOMELEMENTS DATA - ERROR - data:%O, status:%O, headers:%O, config:%O', data, status, headers, config);
                initRoomElementsDeferred.reject('UAPI fetch failed');
            });

            return initRoomElementsDeferred.promise;
        }

        this.getById = function getById(typeId, id) {
            var deferred = $q.defer();
            var element;

            self.initRoomElementsPromise.then(function() {
                if(self.types != undefined && self.types[typeId] != undefined && self.types[typeId].subtype[id] != undefined) {
                    element = self.types[typeId].subtype[id];
                    deferred.resolve(element);
                } else {
                    deferred.reject('Could nor retrieve element');
                }
            });

            return deferred.promise;
        }

        this.getBySIGUARoomId = function getBySIGUARoomId(SIGUARoomId) {
            var deferred = $q.defer();
            var elements;

            self.initRoomElementsPromise.then(function() {
                if(self.room && self.room[SIGUARoomId]) {
                    elements = self.room[SIGUARoomId].elements;
                    deferred.resolve(elements);
                } else {
                    deferred.reject('Could nor retrieve elements');
                }
            });
            
            return deferred.promise;
        }

        /**
         * Imports UGE room data from UPI and generates a mapping between UGE room id and SIGUA room id
         * @param  {UAPI_UGERoomData} UGERoomArray Array of UGE room data fetched from (https://dev.datos.ua.es/uapi/{apiKey}/datasets/784/data)
         * @return {UGERoomMapping} Holds mapping grom UGE_id to SIGUA_id and viceversa
         */
        this.import_UGE_RoomData = function import_UGE_RoomData(UGERoomArray, deferred) {
            var UGERoomData;

            self.UGE = {};
            self.UGE.UGERoomId2SIGUARoomId = {};
            self.UGE.SIGUARoomId2UGERoomId = {};

            for(var i = 0; i < UGERoomArray.length; i++) {
                UGERoomData = UGERoomArray[i];

                self.UGE.UGERoomId2SIGUARoomId[UGERoomData.AUL_CODNUM] = UGERoomData.ID_SIGUA;
                self.UGE.SIGUARoomId2UGERoomId[UGERoomData.ID_SIGUA] = UGERoomData.AUL_CODNUM;
            }

            deferred.resolve('done');

            return deferred;
        }

        /**
         * Parses a {UAPI_RoomElements[]} to {HashMap<String,{ElementTypes}>} and generates a room.elements index
         * 
         * @param  {UAPI_RoomElements[]} UAPI_RoomElementsArray Rooms elements array retirved from https://dev.datos.ua.es/uapi/{apiKey}/datasets/805/data
         * @return {HashMap<String,{ElementTypes}>} Object generated from parse
         *
         * @param {HashMap<String,{ElementTypes}>} this.types Is reset in this function (description above class definition)
         * @param {HashMap<String,Object>} this.room Is reset in this function (description above class definition)
         */
        this.import_UAPI_RoomElements = function import_UAPI_RoomElements(UAPI_RoomElementsArray, deferred) {
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
        }

        this.getUAOpenData_datasetURL = function getUAOpenData_datasetURL(datasetId, mode) {
            return 'https://dev.datos.ua.es/uapi/' + this.UAOpenData_APIKey + '/datasets/' + datasetId + '/' + mode;
        }

        /**
         * {ElementTypesTable}
         *
         * Table format of {ElementTypes} to ease ordering and csv export
         * 
         * @property {String[][]} table.data Table represntation of "types" attribute. First row holds table.colums attribute
         * @property {String[]} table.columns Ordered column names of the table
         * @property {HashMap<String,int>} table.colIndex Column names to index number mapping 
         */
        this.table.init = function init() {
            //NOTICE "this" here references to Elements.table. "self" references "Elements".
            this.data = undefined;
            this.columns = [
                "ID_TIPELEMENTO",
                "TPE_DESID1",
                "TPE_DESID2",
                "TPE_DESID3",
                "ID_ELEMENTO",
                "ELE_DESID1",
                "ELE_DESID2",
                "ELE_DESID3",
                "OBSELE"
            ];

            this.colIndex = this.generate_columnIndexes(this.columns);
        }

        this.table.generate = function table_generate(types) {
            //NOTICE "this" here references to Elements.table. "self" references "Elements".
            if (types == undefined) types = self.types;

            var typeName;
            var elementType;
            var elementName
            var element;
            var elementRow;
            var typesTable = [];

            //Ignored header to ease sorting. Headers is included on export
            //var tableHeader = this.columns;
            //typesTable.push(tableHeader);

            for (typeName in types) {
                elementType = types[typeName];
                for (elementName in elementType.subtype) {
                    element = elementType.subtype[elementName];

                    elementRow = this.element2row(types, element);
                    typesTable.push(elementRow);
                }
            }

            this.data = typesTable;

            return typesTable;
        }

        /**
         * Order the table first by {ElementType} id and then by {Element} id
         */
        this.table.order = function order(table) {
            if (table == undefined) table = this.data;

            if (table != undefined) {
                var column_typeId = this.colIndex.ID_TIPELEMENTO;
                var column_elementId = this.colIndex.ID_ELEMENTO;
                var comparation = 0;

                //Sorting modified from (http://stackoverflow.com/questions/51165/how-do-you-do-string-comparison-in-javascript)
                table.sort(function(a, b) {

                    if (a[column_typeId] < b[column_typeId]) comparation = -1;
                    else if (a[column_typeId] > b[column_typeId]) comparation = 1;
                    //Same element type id scenario. So check element id
                    else if (a[column_elementId] < b[column_elementId]) comparation = -1;
                    else if (a[column_elementId] > b[column_elementId]) comparation = 1;
                    return comparation;
                });
            }

            this.data = table;

            return table
        }

        /**
         * Generate {HashMap<String,int>} mapping column names to index in the array
         * @param  {String[]} columnsArray Array with the names of the columns
         * @return HashMap<String,int> Mapping of the names to their indexes
         */
        this.table.generate_columnIndexes = function generate_columnIndexes(columnsArray) {
            var colIndex = {};

            for (var i = 0; i < columnsArray.length; i++) {
                colIndex[columnsArray[i]] = i;
            }

            return colIndex;
        }

        this.init();

    }]);