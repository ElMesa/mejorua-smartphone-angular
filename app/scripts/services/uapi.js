'use strict';

/**
 * @ngdoc service
 * @name mejoruaSmartphoneAngularApp.UAPI
 * @description
 * # UAPI
 * 
 * DAO and config service to access Univeristy of Alicante OpenData API
 *
 * UAPI exposes the datasets in various formats along with metadata about the datasets
 *
 * @param {String} key UAPI key to access the API
 *
 * @param {Hashmap<String,int>} datasetId Mapping of dataset names with their indexes
 *
 * @see  https://dev.datos.ua.es/apidoc-en.html UAPI documentation
 * @see  https://dev.datos.ua.es/apikey.html UAPI key managing
 */
angular.module('mejoruaSmartphoneAngularApp')
    .service('UAPI', ['$http', function($http) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var self;

        this.key;

        this.datasetId;

        this.init = function init() {
        	console.log('UAPI.init()');
            self = this;

            this.key = 'XBfkmAYGUpAG8Yedh4WT';

            this.datasetId = {};
            this.datasetId.roomCharacteristics = 804;
            this.datasetId.roomElements = 805;
            this.datasetId.roomUGEData = 784;

        }

        this.getDatasetURL = function getDatasetURL(datasetId, mode) {
            return 'https://dev.datos.ua.es/uapi/' + this.key + '/datasets/' + datasetId + '/' + mode;
        }

        this.getDataset = function getDataset(datasetId, mode) {
        	var promise;
        	var url;

        	url = this.getDatasetURL(datasetId, mode);

        	promise = $http.jsonp(url + '?callback=JSON_CALLBACK');

        	return promise;
        }
        
        this.init();
    }]);