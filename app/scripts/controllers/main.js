'use strict';

/**
 * @ngdoc function
 * @name mejoruaSmartphoneAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mejoruaSmartphoneAngularApp
 */
angular.module('mejoruaSmartphoneAngularApp')
    .controller('MainCtrl', ['$scope', 'Restangular', function($scope, Restangular) {

    	//REFACTOR - DAO SERVICE
    	var API_URL = 'http://localhost:8080/mejorua-api/api';
    	Restangular.setBaseUrl(API_URL);

        var issuesResource = Restangular.all('issues');

        issuesResource.getList().then(function(issues) {
            $scope.issues = issues;
        });
        //REFACTOR-END - DAO SERVICE

        /*
        $scope.issues = [{
            id: 1,
            state: 'DONE'
        }, {
            id: 2,
            state: 'DONE'
        }, {
            id: 3,
            state: 'DONE'
        }];
        */
    }]);