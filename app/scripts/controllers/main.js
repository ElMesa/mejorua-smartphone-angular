'use strict';

/**
 * @ngdoc function
 * @name mejoruaSmartphoneAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mejoruaSmartphoneAngularApp
 */
angular.module('mejoruaSmartphoneAngularApp')
    .controller('MainCtrl', ['$scope', 'Restangular', 'issueDetailShared', function($scope, Restangular, issueDetailShared) {

        $scope.issueDetailShared = issueDetailShared;

    }]);