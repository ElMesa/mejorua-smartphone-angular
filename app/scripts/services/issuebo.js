'use strict';

/**
 * @ngdoc service
 * @name mejoruaSmartphoneAngularApp.IssueBO
 * @description
 * # IssueBO
 * Service in the mejoruaSmartphoneAngularApp.
 */
angular.module('mejoruaSmartphoneAngularApp')
    .service('IssueBO', ['IssueDAO', 'SiguaDAO', function(IssueDAO, SiguaDAO) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var self; //Used to hold "this"

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
            this.models.issue = undefined; // {API.IssueTO}Underliying issue model, obtained remotelly with a shared structure between client and server
            this.models.SIGUA = {}; //Remote SIGUA data to compose the view data
            this.models.SIGUA.room = undefined; // {SIGUA.Estancia}
            this.models.SIGUA.building = undefined; // {SIGUA.Edificio}
            this.models.SIGUA.headquarters = undefined; // {SIGUA.Sede}
        }

        this.create = function create() {
            var newIssue = angular.copy(this);
            newIssue.init();
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
            var fetchPromise;

            //Id selection
            if (issueId == undefined) {
                if (this.models.issue.id != undefined) {
                    issueId = this.models.issue.id;
                } else {
                    console.log("IssueBO.fetch() - ERROR - No id provided or contained in embeded model");
                }
            }

            //Fetch
            fetchPromise = IssueDAO.getById(issueId);
            fetchPromise.then(function(issue) {
                self.models.issue = issue;
                self.updateSIGUAData();
                self.updateViewData(["API.issue"]);
            });

            return fetchPromise;
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

    }]);