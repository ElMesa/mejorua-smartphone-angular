'use strict';

/**
 * @ngdoc function
 * @name mejoruaSmartphoneAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mejoruaSmartphoneAngularApp
 */
angular.module('mejoruaSmartphoneAngularApp')
    .controller('MainCtrl', ['$scope', '$location', 'issueDetailShared', 'MapBOExports', function($scope, $location, issueDetailShared, MapBOExports) {

        $scope.issueDetailShared = issueDetailShared;

        $scope.notifyModeClick = function notifyModeClick() {
        	MapBOExports.setIsNotifyMode(true);
        	$location.path('/issuesMap');
        };

    }]);