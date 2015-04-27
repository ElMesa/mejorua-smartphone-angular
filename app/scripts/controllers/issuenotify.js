'use strict';

/**
 * @ngdoc function
 * @name mejoruaSmartphoneAngularApp.controller:IssuenotifyCtrl
 * @description
 * # IssuenotifyCtrl
 * Controller of the mejoruaSmartphoneAngularApp
 */
angular.module('mejoruaSmartphoneAngularApp')
    .controller('IssuenotifyCtrl', ['$scope', 'IssueDAO', 'IssueBO', 'MapBOExports', 'RoomElementsDAO', 'RoomCharacteristicsDAO', function($scope, IssueDAO, IssueBO, MapBOExports, RoomElementsDAO, RoomCharacteristicsDAO) {
        var self;

        $scope.issueBO = undefined; //Holds the bussiness object of the shown issue
        $scope.issue = undefined; // Holds issueBO.view, the object composed of remote issue + presentation data (example: for a given state, url of icon, css class)

        $scope.css = {}; //Holds view css
        $scope.css.inputsDisabled = undefined; //CSS to control if inputs are disabled. Depends of "view mode" mode "readonly: to display issues" or "write: to notify issues"

        $scope.isModeReadOnly = undefined;
        $scope.isModeNotify = undefined;

        //DEBUG - Exposed trough scope to be able to explore them with browser debugging tools
        $scope.RoomElementsDAO = RoomElementsDAO;
        $scope.RoomCharacteristicsDAO = RoomCharacteristicsDAO;

        $scope.init = function init() {
            self = this;

            $scope.issueBO = IssueBO.create();
            $scope.issueBO.updateViewData();

            $scope.targetIndex = -1;

            $scope.issueNotify = IssueBO.create();
            $scope.issueNotify.models.issue.latitude = MapBOExports.markerNotify.lat;
            $scope.issueNotify.models.issue.longitude = MapBOExports.markerNotify.lng;
            $scope.issueNotify.models.floor = MapBOExports.markerNotify.data.floor;
            $scope.issueNotify.getIdSIGUAFromFloorLatLng(MapBOExports.markerNotify.data.floor, MapBOExports.markerNotify.lat, MapBOExports.markerNotify.lng).success(function() {
                var roomSIGUAId = $scope.issueNotify.models.issue.idSIGUA;

                $scope.issueNotify.updateSIGUAData();

                $scope._getRoomElements(roomSIGUAId);
                $scope._getRoomCharacteristics(roomSIGUAId);
            });
            $scope.issueNotify.updateViewData();

            $scope.setModeReadOnly(false);
            $scope.isModeNotify = true;
        }

        $scope.setModeReadOnly = function setModeReadOnly(isModeReadOnly) {
            $scope.isModeReadOnly = isModeReadOnly;

            if (isModeReadOnly) {
                $scope.css.inputsDisabled = "disabled";
                $scope.issue = $scope.issueBO;
            } else {
                $scope.css.inputsDisabled = "";
                $scope.issue = $scope.issueNotify;
            }
        }

        $scope.getIconURL = function getIconURL(state) {
            if (state != undefined) return 'views/icons/state' + state + '.html';
            else return undefined;
        }

        $scope.notifyIssue = function notifyIssue() {
            var target = $scope.room.targets[$scope.targetIndex];

            $scope.issueNotify.setTarget(target);

            IssueDAO.add($scope.issueNotify.models.issue);
        }

        $scope._getRoomElements = function getRoomElements(roomSIGUAId) {
            RoomElementsDAO.getBySIGUARoomId(roomSIGUAId).then(function(roomElementsIndex) {
                var elements;
                var element;
                var elementTypeId;
                var elementId;
                var roomElements;

                elements = RoomElementsDAO.types;

                roomElements = [];
                for (var i = 0; i < roomElementsIndex.length; i++) {
                    elementTypeId = roomElementsIndex[i].typeId;
                    elementId = roomElementsIndex[i].id;
                    element = elements[elementTypeId].subtype[elementId];
                    //element.description = elements[element.typeId].subtype[element.id].description.es;
                    roomElements.push(element);
                }

                $scope.room = $scope.room || {};
                $scope.room.elements = roomElements;
                self._mergeRoomTargets();
            });
        }

        $scope._getRoomCharacteristics = function getRoomCharacteristics(roomSIGUAId) {
            RoomCharacteristicsDAO.getBySIGUARoomId(roomSIGUAId).then(function(roomCharacteristicsIndex) {
                var characteristics;
                var characteristic;
                var characteristicId;
                var roomCharacteristics;

                characteristics = RoomCharacteristicsDAO.characteristics;

                roomCharacteristics = [];
                for (var i = 0; i < roomCharacteristicsIndex.length; i++) {
                    characteristicId = roomCharacteristicsIndex[i].id;
                    characteristic = characteristics[characteristicId];
                    //characteristic.description = characteristics[characteristic.id].description.es;
                    roomCharacteristics.push(characteristic);
                }

                $scope.room = $scope.room || {};
                $scope.room.characteristics = roomCharacteristics;
                self._mergeRoomTargets();
            });
        }

        $scope._mergeRoomTargets = function mergeRoomTargets() {
            var targets = [];

            if($scope.room.elements != undefined) targets = targets.concat($scope.room.elements);
            if($scope.room.characteristics != undefined) targets = targets.concat($scope.room.characteristics);

            $scope.room.targets = targets;
            return targets;
        }

        $scope.init();
    }]);