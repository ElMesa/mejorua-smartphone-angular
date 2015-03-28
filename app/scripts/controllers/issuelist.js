'use strict';

/**
 * @ngdoc function
 * @name mejoruaSmartphoneAngularApp.controller:IssuelistCtrl
 * @description
 * # IssuelistCtrl
 * Controller of the mejoruaSmartphoneAngularApp
 */
angular.module('mejoruaSmartphoneAngularApp')
  .controller('IssuelistCtrl', ['$scope', 'IssueBO', function ($scope, IssueBO) {
    
  	$scope.getIconURL = function getIconURL(state) {
      return 'views/icons/state' + state + '.html'
    }

    this.init = function init() {
      var promise;
      var issueBO;
      
      $scope.targetText = {};

      IssueBO.getAll().then(function (issues){

        $scope.issues = issues;

        for(var i = 0; i < issues.length; i++) {
          issueBO = issues[i];

          issueBO.getTargetText().then(function (data) {
            var issueId = data.issueBO.models.issue.id;
            $scope.targetText[issueId] = data.text;
          });
          
        }
      });
    }

    this.init();
  }]);

  
