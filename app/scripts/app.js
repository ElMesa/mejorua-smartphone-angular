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
    .module('mejoruaSmartphoneAngularApp', ['ngRoute', 'restangular', 'leaflet-directive'])

.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/issuelist.html',
            controller: 'IssuelistCtrl'
        })
        .when('/issuesList', {
            templateUrl: 'views/issuelist.html',
            controller: 'IssuelistCtrl'
        })
        .when('/issuesMap', {
            templateUrl: 'views/issuemap.html',
            controller: 'IssuemapCtrl'
        })
        .when('/issueDetail/:issueId', {
            templateUrl: 'views/issuedetail.html',
            controller: 'IssuedetailCtrl'
        })
        .when('/issueNotify', {
            templateUrl: 'views/issuedetail.html',
            controller: 'IssuenotifyCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
})

.filter('myShortDate', function($filter) {    
    var angularDateFilter = $filter('date');
    return function(theDate) {
       return angularDateFilter(theDate, 'dd/MM/yyyy');
    }
});