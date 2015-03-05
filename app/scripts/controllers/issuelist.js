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
    
  	$scope.getIconURL = function getIconURL(state) {
      return 'views/icons/state' + state + '.html'
    }

    this.init = function init() {
        //Bind $scope issues with DAO data
        IssueDAO.getIssuesPromise().then(function() {
            $scope.issues = IssueDAO.issues;    
        });
    }

    this.init();
  }]);

  
