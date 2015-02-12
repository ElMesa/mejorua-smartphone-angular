'use strict';

/**
 * @ngdoc service
 * @name mejoruaSmartphoneAngularApp.IssueDAO
 * @description
 * # IssueDAO
 * Service in the mejoruaSmartphoneAngularApp.
 */
angular.module('mejoruaSmartphoneAngularApp')
    .service('IssueDAO', ['Restangular', function(Restangular) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var self = this;

        this.API_URL = undefined; //Self descriptive
        this.dao = undefined; //Restangular DAO for Issues
        this.issuesPromise = undefined; //Restangular promise. Useful to check if the collection has already been requested. When any code needs te issues, access them trought the promise.then()
        this.issues = undefined; //Issue collection resources

        this.init = function init() {
            this.API_URL = 'http://localhost:8080/mejorua-api/api';
            Restangular.setBaseUrl(this.API_URL);

            this.dao = Restangular.all('issues');
        }

        //Cached getAll. Cached locally at service this.issues. If no cached info detected, request is send
        this.getAll = function getAll() {
            if (this.issuesPromise == undefined || this.issues == undefined) {
                this.issuesPromise = this.dao.getList();
                this.issuesPromise.then(function(issues) {
                    self.issues = issues;
                });
            }
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

        this.init();
    }])

//TODO - REFACTOR - OWN FILE OR ELSEWHERE (Maybe issuedetail service, if created one)
.value('issueDetailShared', {});