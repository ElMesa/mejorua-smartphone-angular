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
        $scope.issueEditing = undefined;

        //Binding actual issue detail to show by ts id to shared service issueDetailShared
        issueDetailShared.id = $routeParams.issueId;

        $scope.css = {}; //Holds view css
        $scope.css.inputsDisabled = undefined; //CSS to control if inputs are disabled. Depends of "view mode" mode "readonly: to display issues" or "write: to notify issues"

        $scope.isModeReadOnly = undefined;

        $scope.init = function init() {
            /*
            $scope.issueBO = IssueBO.create();
            IssueBO.fetch(issueDetailShared.id);
            $scope.issueBO.getTargetText().then(function (data) {
                $scope.targetText = data.text;
            }); 
            $scope.issue = $scope.issueBO;
            */
           
            IssueBO.fetch(issueDetailShared.id).then(function(issueBO) {
                $scope.issueBO = issueBO;

                $scope.issueBO.getTargetText().then(function (data) {
                    $scope.targetText = data.text;
                });
                
                $scope.setModeReadOnly(true);
            });
           
            $scope.setModeReadOnly(true);

            //DEBUG - This {userCan} shoould came from a user/controll service depending on role/user privileges
            $scope.userCan = {}
            $scope.userCan.issue = {};
            $scope.userCan.issue.edit = true;
        }

        $scope.setModeReadOnly = function setModeReadOnly(isModeReadOnly) {
            $scope.isModeReadOnly = isModeReadOnly;

            if (isModeReadOnly) {
                $scope.css.inputsDisabled = "disabled";
                $scope.issue = $scope.issueBO;
            }
            else {
                $scope.css.inputsDisabled = "";
                $scope.issueEditing = angular.copy($scope.issueBO);
                $scope.issue = $scope.issueEditing;
            }
        }

        $scope.getIconURL = function getIconURL(state) {
            if(state != undefined) return 'views/icons/state' + state + '.html';
            else return undefined;
        }

        $scope.issueEditConfirm = function issueEditConfirm() {
            $scope.issueEditing.update();

        }

        $scope.init();
    }]);