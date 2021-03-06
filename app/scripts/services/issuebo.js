'use strict';

/**
 * @ngdoc service
 * @name mejoruaSmartphoneAngularApp.IssueBO
 * @description
 * # IssueBO
 * Service in the mejoruaSmartphoneAngularApp.
 */
angular.module('mejoruaSmartphoneAngularApp')
    .service('IssueBO', ['$q', 'IssueDAO', 'SiguaDAO', 'RoomElementsDAO', 'RoomCharacteristicsDAO', function($q, IssueDAO, SiguaDAO, RoomElementsDAO, RoomCharacteristicsDAO) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var self = this;
        this.promiseGetAll;

        var IssueBO = function IssuesBO() {
            var self; //Used to hold "this"

            this.promiseRemoteIssue;

            //REFACTOR - This should be "java::static", shared by all instances
            this.modelState2viewText = {
                PENDING: 'Acción pendiente',
                INPROGRESS: 'Acción en progreso',
                DONE: 'Acción finalizada'
            }

            //REFACTOR - Use CSS class to mark state (Example: stateTypePENDING) and stateCSSClass to hold the various options and apply in html stateCSSClass
            //Example: Instead of "issueStatePendingBackground" use "stateTypePENDING > stateClass", and in the view, tag the issue.state container with {{"stateType" + stateCode}}
            //Achievement with refactor: Extract presentation data from .js
            this.modelState2viewCSS = {
                PENDING: 'issueStatePendingBackground',
                INPROGRESS: 'issueStateInProgressBackground',
                DONE: 'issueStateDoneBackground'
            }

            //REFACTOR - Same as for: modelState2viewCSS but instead of classes, holding img URL's
            this.modelState2viewIcon = {
                PENDING: 'images/map/icon_pending.png',
                INPROGRESS: 'images/map/icon_inProgress.png',
                DONE: 'images/map/icon_done.png'
            }

            this.modelEventState2viewText = {
                CREATE: 'Creada la incidencia',
                STATE_CHANGE_PENDING: 'Cambiado estado a pendiente',
                STATE_CHANGE_INPROGRESS: 'Cambiado estado a en progreso',
                STATE_CHANGE_DONE: 'Cambiado estado a finalizada'
            }

            this.modelEventState2viewCSS = {
                CREATE: '',
                STATE_CHANGE_PENDING: 'issueStatePendingBackground',
                STATE_CHANGE_INPROGRESS: 'issueStateInProgressBackground',
                STATE_CHANGE_DONE: 'issueStateDoneBackground'
            }

            this.modelSIGUAFloor2viewText = {
                PS: 'Sotano',
                PB: 'Planta baja',
                P1: 'Planta primera',
                P2: 'Planta segunda',
                P3: 'Planta tercera',
                P4: 'Planta cuarta'
            }

            this.view = {}; //Holds the data needed in the view combining the API model + extra info

            this.init = function init() {
                self = this;

                this.models = {};
                this.models.issue = {}; // {API.IssueTO}Underliying issue model, obtained remotelly with a shared structure between client and server
                this.models.issue.state = 'PENDING';
                this.models.SIGUA = {}; //Remote SIGUA data to compose the view data
                this.models.SIGUA.room = undefined; // {SIGUA.Estancia}
                this.models.SIGUA.building = undefined; // {SIGUA.Edificio}
                this.models.SIGUA.headquarters = undefined; // {SIGUA.Sede}
            }

            this.update = function update() {
                var promise = IssueDAO.update(this.models.issue).then(function(updatedIssue) {
                    //self.models.issue = updatedIssue;
                    $.extend(true, self.models.issue, updatedIssue);
                });

                return promise;
            }

            this.updateSIGUAData = function updateSIGUAData() {
                var SIGUARoomPromise;
                var SIGUABuildingPromise;
                var SIGUAHeadquartersPromise;
                var roomId;
                var buildingID;
                var headquartersID;

                self.models.SIGUA = {}; //Reset old data

                if (this.models.issue != undefined && self.models.issue.idSIGUA != undefined) {
                    roomId = this.models.issue.idSIGUA;
                    SIGUARoomPromise = SiguaDAO.roomGetById(roomId);
                    SIGUARoomPromise.then(function(SIGUARoom) {
                        self.models.SIGUA.room = SIGUARoom;
                        self.updateViewData(['SIGUA.room']);
                    });

                    buildingID = roomId.substring(0, 4);
                    SIGUABuildingPromise = SiguaDAO.buildingGetById(buildingID);
                    SIGUABuildingPromise.then(function(SIGUABuilding) {
                        self.models.SIGUA.building = SIGUABuilding[0];
                        self.updateViewData(['SIGUA.building']);
                    });

                    headquartersID = roomId.substring(0, 2);
                    SIGUAHeadquartersPromise = SiguaDAO.headquartersGetById(headquartersID);
                    SIGUAHeadquartersPromise.then(function(SIGUAHeadquarters) {
                        self.models.SIGUA.headquarters = SIGUAHeadquarters[0];
                        self.updateViewData(['SIGUA.headquarters']);
                    });
                } else {
                    console.log("IssueBO.updateSIGUAData() - ERROR - No issue model found or idSIGUA missing - this.models.issue: %O", this.models.issue);
                }
            }

            this.updateViewData = function updateViewData(attributesToUpdate) {
                var shouldUpdate;
                var modelEvent;

                //Precaulated {shouldUpdate} object, from array "attributesToUpdate". 
                shouldUpdate = {};
                shouldUpdate.API = {};
                shouldUpdate.SIGUA = {};
                if (attributesToUpdate == undefined) {
                    shouldUpdate.all = true;
                } else {
                    shouldUpdate.all = false;
                    if (attributesToUpdate.indexOf("API.issue") != -1) shouldUpdate.API.issue = true;

                    if (attributesToUpdate.indexOf("SIGUA.room") != -1) shouldUpdate.SIGUA.room = true;
                    if (attributesToUpdate.indexOf("SIGUA.building") != -1) shouldUpdate.SIGUA.building = true;
                    if (attributesToUpdate.indexOf("SIGUA.headquarters") != -1) shouldUpdate.SIGUA.headquarters = true;
                }

                //If there is remote issue gathered
                if (this.models.issue != undefined) {

                    if (shouldUpdate.all || shouldUpdate.API.issue) {
                        this.view.id = this.models.issue.id;
                        this.view.action = this.models.issue.action;
                        this.view.term = this.models.issue.term;
                        this.view.state = {};
                        this.view.state.value = this.models.issue.state;
                        this.view.state.text = this.modelState2viewText[this.models.issue.state];
                        this.view.state.CSS = this.modelState2viewCSS[this.models.issue.state];
                        this.view.state.icon = this.modelState2viewIcon[this.models.issue.state];
                        this.view.latitude = this.models.issue.latitude;
                        this.view.longitude = this.models.issue.longitude;
                        this.view.events = this.models.issue.events;

                        for (var eventIndex in this.models.issue.events) {
                            modelEvent = this.models.issue.events[eventIndex];

                            this.view.events[eventIndex].typeText = this.modelEventState2viewText[modelEvent.type];
                            this.view.events[eventIndex].CSS = this.modelEventState2viewCSS[modelEvent.type];
                        }
                    }

                    //If there's SIGUA remote models gathered
                    if (this.models.SIGUA != undefined) {

                        //SIGUA.room update
                        if (shouldUpdate.all || shouldUpdate.SIGUA.room) {
                            if (this.models.SIGUA.room != undefined) {
                                this.view.SIGUA = this.view.SIGUA || {};
                                this.view.SIGUA.room = {};
                                this.view.SIGUA.room.denomination = this.models.SIGUA.room.features[0].properties.denominacion;
                                this.view.SIGUA.room.activityName = this.models.SIGUA.room.features[0].properties.nombre_actividad;
                                this.view.SIGUA.room.floor = this.models.issue.idSIGUA.substring(4, 6);
                                this.view.SIGUA.room.floorText = this.modelSIGUAFloor2viewText[this.view.SIGUA.room.floor];
                            } else {
                                console.log("IssueBO.updateViewData() - ERROR - No model found - on SIGUA.room view update");
                            }
                        }

                        //SIGUA.building update
                        if (shouldUpdate.all || shouldUpdate.SIGUA.building) {
                            if (this.models.SIGUA.building != undefined) {
                                this.view.SIGUA = this.view.SIGUA || {};
                                this.view.SIGUA.building = {};
                                this.view.SIGUA.building.name = this.models.SIGUA.building.nombre;
                            } else {
                                console.log("IssueBO.updateViewData() - ERROR - No model found - on SIGUA.building view update");
                            }
                        }

                        //SIGUA.headquarters update
                        if (shouldUpdate.all || shouldUpdate.SIGUA.headquarters) {
                            if (this.models.SIGUA.headquarters != undefined) {
                                this.view.SIGUA = this.view.SIGUA || {};
                                this.view.SIGUA.headquarters = {};
                                this.view.SIGUA.headquarters.name = this.models.SIGUA.headquarters.nombre;
                            } else {
                                console.log("IssueBO.updateViewData() - ERROR - No model found - on SIGUA.headquarters view update");
                            }
                        }
                    }
                } else {
                    console.log("IssueBO.updateViewData() - ERROR - No model found - model.issue missing on view update");
                }
            }

            this.getFloorText = function getFloorText() {
                var floor;
                var floorText;

                if (this.models.issue != undefined && this.models.issue.idSIGUA != undefined) {
                    floor = this.models.issue.idSIGUA.substring(4, 6);
                } else if (this.models.floor != undefined) {
                    floor = this.models.floor;
                }

                if (floor != undefined) {
                    floorText = this.modelSIGUAFloor2viewText[floor];
                }

                return floorText;
            }

            /**
             * Get the text asociated with the target of the issue
             *
             * Is promise based because the text comes frome remote data, the issue just haves identifiers of the target
             *
             * It's assumed the remoteIssue it's already fetched. Right now every scenario fits with this assumption.
             * 
             * @return {$q.defer().promise} Promise with 
             */
            this.getTargetText = function getTargetText() {
                var deferred = $q.defer();
                var text;
                var target;

                if (self.models.issue != undefined && self.models.issue.target != undefined) {
                    target = self.models.issue.target;
                    switch (target.type) {
                        case "GENERIC":
                            deferred.resolve({
                                text: target.genericDesciption,
                                issueBO: self
                            });
                            break;
                        case "ELEMENT":
                            RoomElementsDAO.getById(target.typeId, target.id).then(function(element) {
                                deferred.resolve({
                                    text: element.description.es,
                                    issueBO: self
                                });
                            });
                            break;
                        case "CHARACTERISTIC":
                            RoomCharacteristicsDAO.getById(target.typeId, target.id).then(function(element) {
                                deferred.resolve({
                                    text: element.description.es,
                                    issueBO: self
                                });
                            });
                            break;
                        default:
                            deferred.reject('Unknown target type');
                            break;
                    }
                }

                return deferred.promise;
            }

            this.getIdSIGUAFromFloorLatLng = function getIdSIGUAFromFloorLatLng(floor, lat, lng) {
                var promise = SiguaDAO.idGetByFloorLatLng(floor, lat, lng);
                promise.success(function(data) {
                    console.log('IssueBO.getIdSIGUAFromFloorLatLng() - fetch success data:%O', data);
                    self.models.issue.idSIGUA = data.features[0].properties.codigo;
                });
                return promise;
            }

            /**
             * Set's IssueBO target adapting it to the remote API.IssueTargetYO
             *
             * We get rid of attributes description and observations wich arent in the remote
             * API.IssueTargetYO class (allows simple JSON parsing on backend)
             * 
             * @param {[type]} target [description]
             */
            this.setTarget = function setTarget(target) {
                var filteredTarget;

                filteredTarget = angular.copy(target);
                filteredTarget.description = undefined;
                filteredTarget.observations = undefined;

                this.models.issue.target = filteredTarget;
            }

            this.init();
        }

        this.create = function create(remoteIssue) {
            var newIssue;

            newIssue = new IssueBO();
            newIssue.init();

            if (remoteIssue != undefined) newIssue.models.issue = remoteIssue;
            return newIssue;
        }

        this.createRandom = function createRandom() {
            //UA top left: 38.388925, -0.518961
            //UA bottom right: 38.380796, -0.508049
            //
            var UATopLeftLat = 38.388925;
            var UATopLeftLong = -0.518961;
            var UABottomRightLat = 38.380796;
            var UABottomRightLong = -0.508049;

            //Random float between 2 values
            var UArandomLat = Math.random() * (UABottomRightLat - UATopLeftLat) + UATopLeftLat
            var UArandomLong = Math.random() * (UABottomRightLong - UATopLeftLong) + UATopLeftLong

            var randomIssue = this.create();

            randomIssue.models.issue = {};
            randomIssue.models.issue.action = "Random action";
            randomIssue.models.issue.term = "Random term";
            randomIssue.models.issue.idSIGUA = "Random_" + new Date().getMilliseconds(); + "_" + Math.random();
            randomIssue.models.issue.latitude = UArandomLat;
            randomIssue.models.issue.longitude = UArandomLong;

            return randomIssue;
        }

        //Fetch using provided id or use embebed model id if no id provided. Returns a promise.
        this.fetch = function fetch(issueId) {
            var deferred = $q.defer();
            var remoteIssuePromise;

            //Fetch
            IssueDAO.getById(issueId).then(function(remoteIssue) {

                var issueBO;

                issueBO = self.create(remoteIssue);

                issueBO.updateSIGUAData();
                issueBO.updateViewData(["API.issue"]);

                issueBO.promiseRemoteIssue = deferred.promise;
                deferred.resolve(issueBO);
            });

            return deferred.promise;
        }

        /**
         * Get all IssuesBO with just the remote issue
         *
         * Fetches issues from DAO and creates their IssueBO with the remote data obtained (No other data fetched like SIGUA room data or room elements)
         *
         * @return {$q.defer().promise} Promise with the {IssueBO[]} param in resolve callback
         *
         * @param {IssueBO[]} this.issues is reset during this function. Definition above in class description.
         */
        this.getAll = function getAll() {
            var deferred = $q.defer();
            var remoteIssue;
            var issueBO;
            var issuesBO;

            IssueDAO.getAll().then(function(issues) {

                issuesBO = [];
                for (var i = 0; i < issues.length; i++) {
                    remoteIssue = issues[i];
                    issueBO = self.create(remoteIssue);
                    issueBO.promiseRemoteIssue = deferred.promise;
                    issuesBO.push(issueBO);
                }

                self.issues = issuesBO;
                deferred.resolve(issuesBO);
            });

            self.promiseGetAll = deferred.promise;
            return deferred.promise;
        }

        this.getTargetTextIndex = function getTargetTextIndex() {
            var deferred = $q.defer();

            if(self.targetTextIndex == undefined) {
                self.targetTextIndex = {};

                this.getAll().then(function(issues) {
                    var issueBO;

                    self.targetTextIndexSyncCount = issues.length;

                    for (var i = 0; i < issues.length; i++) {
                        issueBO = issues[i];

                        issueBO.getTargetText().then(function(data) {
                            var issueId = data.issueBO.models.issue.id;
                            self.targetTextIndex[issueId] = data.text;

                            self.targetTextIndexSyncCount--;
                            if(self.targetTextIndexSyncCount == 0) deferred.resolve(self.targetTextIndex);
                        });

                    }
                });
            } else {
                deferred.resolve(self.targetTextIndex);
            }

            return deferred.promise;
        }

        //this.init();

    }]);