'use strict';

/**
 * @ngdoc service
 * @name mejoruaSmartphoneAngularApp.IssueDAO
 * @description
 * # IssueDAO
 * Service in the mejoruaSmartphoneAngularApp.
 */
angular.module('mejoruaSmartphoneAngularApp')
    .service('IssueDAO', ['Restangular', 'ObserverService', '$http', function(Restangular, ObserverService, $http) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var self;

        this.observer = undefined; //Observer for event callbacks on IssueDAO

        this.API_URL = undefined; //Self descriptive
        this.dao = undefined; //Restangular DAO for Issues
        this.issuesPromise = undefined; //Restangular promise. Useful to check if the collection has already been requested. When any code needs te issues, access them trought the promise.then()
        this.issues = undefined; //Issue collection resources

        this.init = function init() {
            self = this;

            this.observer = ObserverService.create();
            this.observer.addEvent("fetch");
            this.observer.addEvent("add");

            this.API_URL = 'http://localhost:8080/mejorua-api/api';
            Restangular.setBaseUrl(this.API_URL);

            this.dao = Restangular.all('issues');
            //this.issues = {};
            this.getAll();
        }

        this.getIssuesPromise = function getIssuesPromise() {
            if (this.issuesPromise == undefined) this.getAll();

            return this.issuesPromise;
        }


        //Cached getAll. Cached locally at service this.issues. If no cached info detected, request is send
        this.getAll = function getAll() {
            if (this.issuesPromise == undefined) this.getAllRemote();
            return this.issuesPromise;
        }

        this.getAllRemote = function getAllRemote() {
            this.issuesPromise = this.dao.getList();
            this.issuesPromise.then(function(issues) {
                self.issues = issues;
                self.observer.notify("fetch", issues);
            });

            return this.issuesPromise;
        }

        //Uncached getById
        this.getById = function getById(issueId) {
            console.log('IssueDAO.getById(issueId: %O)', issueId);
            return this.dao.get(issueId);
        }

        //If finally we use cached resources, this is the API Call, instead of the cache lookup
        /*
        this.getByIdRemote = function getByIdRemote(issueId) {

            if (this.issues == undefined) this.getAll();

            this.issues.then(function(issues) {
                filteredIssues = jQuery.grep(this.issues, function(id) {
                    return (id === issueId);
                });
            });

        }
        */

        this.add = function add(issue) {

            this.issues.post(issue).then(function() {
                self.getAll();
            });
        }

        this.update = function update(issue) {
            //FIX - The use of copy comes from a Restangular BUG on put(): It uses originally fetched data on put, instead the modified one (https://github.com/mgonto/restangular/issues/713)
            return Restangular.copy(issue).put();
        }

        this.init();
    }])

//TODO - REFACTOR - OWN FILE OR ELSEWHERE (Maybe issuedetail service, if created one)
.value('issueDetailShared', {});