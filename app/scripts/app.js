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
})

.filter('myLongDate', function($filter) {    
    var angularDateFilter = $filter('date');
    return function(theDate) {
       return angularDateFilter(theDate, 'dd/MM/yyyy HH:mm:ss');
    }
})

.filter('myShortDateFromMiliseconds', function($filter) {    
    //var angularDateFilter = $filter('date');
    var myShortDateFilter = $filter('myShortDate');
    return function(dateMiliseconds) {
        var theDate = new Date(dateMiliseconds);
        //return angularDateFilter(theDate, 'dd/MM/yyyy');
        return myShortDateFilter(theDate);
    }
})

.filter('myLongDateFromMiliseconds', function($filter) {    
    var myLongDateFilter = $filter('myLongDate');
    return function(dateMiliseconds) {
        var theDate = new Date(dateMiliseconds);
        return myLongDateFilter(theDate);
    }
});