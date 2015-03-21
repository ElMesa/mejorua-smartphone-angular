'use strict';

/**
 * @ngdoc function
 * @name mejoruaSmartphoneAngularApp.controller:IssuenotifyCtrl
 * @description
 * # IssuenotifyCtrl
 * Controller of the mejoruaSmartphoneAngularApp
 */
angular.module('mejoruaSmartphoneAngularApp')
  .controller('IssuenotifyCtrl', ['$scope', 'IssueDAO', 'IssueBO', 'MapBOMarkerNotify', function ($scope, IssueDAO, IssueBO, MapBOMarkerNotify) {
    	$scope.issueBO = undefined; //Holds the bussiness object of the shown issue
        $scope.issue = undefined; // Holds issueBO.view, the object composed of remote issue + presentation data (example: for a given state, url of icon, css class)

        $scope.css = {}; //Holds view css
        $scope.css.inputsDisabled = undefined; //CSS to control if inputs are disabled. Depends of "view mode" mode "readonly: to display issues" or "write: to notify issues"

        $scope.isModeReadOnly = undefined;
        $scope.isModeNotify = undefined;

        $scope.init = function init() {
            $scope.issueBO = IssueBO.create();
            $scope.issueBO.updateViewData();

            $scope.issueNotify = IssueBO.create();
            $scope.issueNotify.models.issue.latitude = MapBOMarkerNotify.lat;
            $scope.issueNotify.models.issue.longitude = MapBOMarkerNotify.lng;
            $scope.issueNotify.models.floor = MapBOMarkerNotify.data.floor;
            $scope.issueNotify.getIdSIGUAFromFloorLatLng(MapBOMarkerNotify.data.floor, MapBOMarkerNotify.lat, MapBOMarkerNotify.lng).success(function () {
                $scope.issueNotify.updateSIGUAData();    
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
            IssueDAO.add($scope.issueNotify.models.issue);
        }

        $scope.init();
  }]);
