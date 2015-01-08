'use strict';

/**
 * @ngdoc overview
 * @name mejoruaSmartphoneAngularApp
 * @description
 * # mejoruaSmartphoneAngularApp
 *
 * Main module of the application.
 */
angular
    .module('mejoruaSmartphoneAngularApp', ['ngRoute', 'restangular'])

.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/issuelist.html',
            controller: 'IssuelistCtrl'
        })
        .when('/issueList', {
            templateUrl: 'views/issuelist.html',
            controller: 'IssuelistCtrl'
        })
        .when('/issueDetail/:issueId', {
          templateUrl: 'views/issuedetail.html',
          controller: 'IssuedetailCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});