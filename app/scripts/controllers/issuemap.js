'use strict';

/**
 * @ngdoc function
 * @name mejoruaSmartphoneAngularApp.controller:IssuemapCtrl
 * @description
 * # IssuemapCtrl
 * Controller of the mejoruaSmartphoneAngularApp
 */
angular.module('mejoruaSmartphoneAngularApp')
    .controller('IssuemapCtrl', ['$scope', 'MapBO',function($scope, MapBO) {

        $scope.map = MapBO;

        $scope.setFloorLayer = function setFloorLayer(floor) {
            $scope.map.activeFloorLayerDelete();
            $scope.$apply(); //¡SMELL! - Needed to refresh map view. Layers won't show unless old ones deleted first. Deleting and changing layers at the same time won't work.

            $scope.map.setActiveFloorLayer(floor);
        }

    }]);