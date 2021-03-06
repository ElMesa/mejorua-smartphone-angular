'use strict';

/**
 * @ngdoc function
 * @name mejoruaSmartphoneAngularApp.controller:IssuemapCtrl
 * @description
 * # IssuemapCtrl
 * Controller of the mejoruaSmartphoneAngularApp
 */
angular.module('mejoruaSmartphoneAngularApp')
    .controller('IssuemapCtrl', ['$scope', '$location', 'MapBO', 'MapBOExports', 'IssueDAO', 'IssueBO', 'RoomElementsDAO', 'SiguaDAO', 'RoomCharacteristicsDAO', function($scope, $location, MapBO, MapBOExports, IssueDAO, IssueBO, RoomElementsDAO, SiguaDAO, RoomCharacteristicsDAO) {

        $scope.map;
        $scope.targetTextIndex;

        //$scope.test = "test";
        angular.extend($scope, {
            test: "test"
        });

        $scope.init = function init() {
            $scope.MapBOExports = MapBOExports;

            $scope.map = MapBO;
            $scope.map.setTargetScope($scope);

            IssueBO.getTargetTextIndex().then(function(targetTextIndex) {
                $scope.targetTextIndex = targetTextIndex;
            });
        }

        $scope.setFloorLayer = function setFloorLayer(floor) {
            $scope.map.activeFloorLayerDelete();
            //¡SMELL! - Needed to refresh map view. Layers won't show unless old ones deleted first. Deleting and changing layers at the same time won't work.
            //Another alternative is using "layer.visible" but implies having always all floor layers downloaded (better bandwith performance #perfmatters)
            $scope.$apply();

            $scope.map.setActiveFloorLayer(floor);
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// DEBUG METHODS
        /// 
        /// Remove IssueDAO and IssueBO dependencies after debugging is done
        ///
        //////////////////////////////////////////////////////////////////////////////////////////////////
        $scope.issueDAO = IssueDAO;
        $scope.issues = IssueDAO.issues;

        function DEBUGinit() {
            //$scope.map.markers.active.test = DEBUGmarkerSingleTest;
            //$scope.map.markers.active = DEBUGmarkerPopulate();
        }

        //Clustering test
        function DEBUGmarkerPopulate() {
            var markers = {};

            for (var i = 0; i < 100; i++) {
                markers[i] = DEBUGmarkerCreate();
            }

            return markers;
        }

        //Individual marker creation for clustering test
        function DEBUGmarkerCreate() {
            //UA top left: 38.388925, -0.518961
            //UA bottom right: 38.380796, -0.508049
            //
            var UATopLeftLat = 38.388925;
            var UATopLeftLong = -0.518961;
            var UABottomRightLat = 38.380796;
            var UABottomRightLong = -0.508049;

            //Random float between 2 values
            var UArandomLat = Math.random() * (UABottomRightLat - UATopLeftLat) + UATopLeftLat
            var UArandomLong = Math.random() * (UABottomRightLong - UATopLeftLong) + UATopLeftLong

            var marker = {
                group: "ua",
                lat: UArandomLat,
                lng: UArandomLong
            }

            return marker;
        }

        function DEBUGmarkerSingleTest() {
            var markerTest = {
                lat: 38.383572,
                lng: -0.512019,
                //focus: true,
                message: '<a class="btn btn-danger">TEST {{1+1}}</a>',
                draggable: true,
                opacity: 1
                    //Requires: href="../bower_components/Leaflet.label/dist/leaflet.label.css" />
                    /*
                    label: {
                        message: "Hey, drag me if you want",
                        options: {
                            noHide: true
                        }
                    }
                    */

            }

            return marker;
        }

        $scope.DEBUGissuePost = function DEBUGissuePost() {
            var randomIssue = IssueBO.createRandom();
            IssueDAO.add(randomIssue.models.issue);
        }

        $scope.DEBUGmarkersAddLayerRoomsWithElements = function DEBUGmarkersAddLayerRoomsWithElements() {
            var promise;

            promise = RoomElementsDAO.getRooms();
            promise = promise.then(function (roomsWithElements) {
                var roomIdArray = [];
                for(var roomId in roomsWithElements) {
                    roomIdArray.push(roomId);
                }

                var roomsPromise = SiguaDAO.roomGetByIdArray(roomIdArray);
                return roomsPromise;
            });
            promise.then(function (roomsHashMap) {
                MapBO.markersAdd('RoomsWithElements', roomsHashMap, MapBO.source2marker_SIGUARoomId2Marker);
            });
        }

        $scope.DEBUGmarkersAddLayerRoomsWithCharacteristics = function DEBUGmarkersAddLayerRoomsWithCharacteristics() {
            var promise;

            promise = RoomCharacteristicsDAO.getRooms();
            promise = promise.then(function (roomsWithElements) {
                
                var roomIdArray = [];
                for(var roomId in roomsWithElements) {
                    roomIdArray.push(roomId);
                }
                console.log('IssuemapCtrl - DEBUGmarkersAddLayerRoomsWithCharacteristics() - roomIdArray: %O', roomIdArray);

                var roomsPromise = SiguaDAO.roomGetByIdArray(roomIdArray);

                return roomsPromise;
            });
            promise.then(function (roomsHashMap) {
                console.log('IssuemapCtrl - DEBUGmarkersAddLayerRoomsWithCharacteristics() - roomsHashMap: %O', roomsHashMap);

                var options = {
                    icon: {
                        markerColor: 'orange'
                    }
                }

                MapBO.markersAdd('RoomsWithCharacteristics', roomsHashMap, MapBO.source2marker_SIGUARoomId2Marker, options);
                console.log('IssuemapCtrl - DEBUGmarkersAddLayerRoomsWithCharacteristics() - DONE');
            });
        }

        $scope.init();
    }])