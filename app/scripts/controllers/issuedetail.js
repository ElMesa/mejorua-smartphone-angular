'use strict';

/**
 * @ngdoc function
 * @name mejoruaSmartphoneAngularApp.controller:IssuedetailCtrl
 * @description
 * # IssuedetailCtrl
 * Controller of the mejoruaSmartphoneAngularApp
 */
angular.module('mejoruaSmartphoneAngularApp')
    .controller('IssuedetailCtrl', ['$scope', '$routeParams','IssueDAO', 'IssueBO', 'issueDetailShared', function($scope, $routeParams, IssueDAO, IssueBO, issueDetailShared) {

        $scope.issueBO = undefined; //Holds the bussiness object of the shown issue
        $scope.issue = undefined; // Holds issueBO.view, the object composed of remote issue + presentation data (example: for a given state, url of icon, css class)

        //Binding actual issue detail to show by ts id to shared service issueDetailShared
        issueDetailShared.id = $routeParams.issueId;

        $scope.css = {}; //Holds view css
        $scope.css.inputsDisabled = undefined; //CSS to control if inputs are disabled. Depends of "view mode" mode "readonly: to display issues" or "write: to notify issues"
        $scope.css.hideOnRead = undefined;

        $scope.isModeReadOnly = undefined;


        $scope.init = function init() {
            $scope.issueBO = IssueBO.create();
            $scope.issueBO.fetch(issueDetailShared.id);
            $scope.issue = $scope.issueBO.view;

            $scope.css.inputsDisabled = "disabled"; //CSS to control if inputs are disabled. Depends of "view mode" mode "readonly: to display issues" or "write: to notify issues"

            $scope.test = "test";

            $scope.isModeReadOnly = true;
        }

        $scope.init();
    }]);