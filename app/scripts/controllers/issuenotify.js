'use strict';

/**
 * @ngdoc function
 * @name mejoruaSmartphoneAngularApp.controller:IssuenotifyCtrl
 * @description
 * # IssuenotifyCtrl
 * Controller of the mejoruaSmartphoneAngularApp
 */
angular.module('mejoruaSmartphoneAngularApp')
  .controller('IssuenotifyCtrl', ['$scope', 'IssueDAO', 'IssueBO', 'MapBOMarkerNotify', 'RoomElementsDAO', function ($scope, IssueDAO, IssueBO, MapBOMarkerNotify, RoomElementsDAO) {
    	$scope.issueBO = undefined; //Holds the bussiness object of the shown issue
        $scope.issue = undefined; // Holds issueBO.view, the object composed of remote issue + presentation data (example: for a given state, url of icon, css class)

        $scope.css = {}; //Holds view css
        $scope.css.inputsDisabled = undefined; //CSS to control if inputs are disabled. Depends of "view mode" mode "readonly: to display issues" or "write: to notify issues"

        $scope.isModeReadOnly = undefined;
        $scope.isModeNotify = undefined;

        //DEBUG
        $scope.RoomElementsDAO = RoomElementsDAO;
        RoomElementsDAO.getAll();

        $scope.init = function init() {
            $scope.issueBO = IssueBO.create();
            $scope.issueBO.updateViewData();

            $scope.targetIndex = -1;

            $scope.issueNotify = IssueBO.create();
            //$scope.issueNotify.models.issue.term = $scope.RoomElementsDAO......;
            $scope.issueNotify.models.issue.latitude = MapBOMarkerNotify.lat;
            $scope.issueNotify.models.issue.longitude = MapBOMarkerNotify.lng;
            $scope.issueNotify.models.floor = MapBOMarkerNotify.data.floor;
            $scope.issueNotify.getIdSIGUAFromFloorLatLng(MapBOMarkerNotify.data.floor, MapBOMarkerNotify.lat, MapBOMarkerNotify.lng).success(function () {
                $scope.issueNotify.updateSIGUAData();
                $scope.RoomElementsDAO.getBySIGUARoomId($scope.issueNotify.models.issue.idSIGUA).then(function (elements) {
                    
                    var element;
                    var roomElements = [];
                    for(var i = 0; i < elements.length; i++) {
                        element = elements[i];
                        element.description = $scope.RoomElementsDAO.types[element.typeId].subtype[element.id].description.es;
                        roomElements.push(element);
                    }

                    $scope.roomElements = elements;
                });
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
            }
        	else {
                $scope.css.inputsDisabled = "";
                $scope.issue = $scope.issueNotify;
            }
        }

        $scope.getIconURL = function getIconURL(state) {
            return 'views/icons/state' + state + '.html'
        }

        $scope.notifyIssue = function notifyIssue() {
            var elementtypeId = $scope.roomElements[$scope.targetIndex].typeId;
            var elementId = $scope.roomElements[$scope.targetIndex].id;

            $scope.issueNotify.setTarget('ELEMENT', elementtypeId, elementId, undefined);

            IssueDAO.add($scope.issueNotify.models.issue);
        }

        $scope.init();
  }]);
