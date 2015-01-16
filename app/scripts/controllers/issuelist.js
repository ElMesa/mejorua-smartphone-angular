'use strict';

/**
 * @ngdoc function
 * @name mejoruaSmartphoneAngularApp.controller:IssuelistCtrl
 * @description
 * # IssuelistCtrl
 * Controller of the mejoruaSmartphoneAngularApp
 */
angular.module('mejoruaSmartphoneAngularApp')
  .controller('IssuelistCtrl', ['$scope', 'IssueDAO', function ($scope, IssueDAO) {
    
    this.init = function init() {
    	$scope.issuesGetAll();
    }

    $scope.issuesGetAll = function issuesGetAll() {
    	IssueDAO.getAll().then(function(issues) {
            $scope.issues = issues;
        });
    }

    this.init();
  }]);

  
