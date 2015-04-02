'use strict';

/**
 * @ngdoc service
 * @name mejoruaSmartphoneAngularApp.MapBO
 * @description
 * # MapBO
 * Service in the mejoruaSmartphoneAngularApp.
 *
 * Notice this is the only one service not self initialised. Thats
 * beacuse it needs the Controller.$scope to use data binding in
 * the markers popup message. (Holded in "this.targetScope" and used in
 * "this.markersUpdate()" )
 */

//REFACTOR - Decrease dependencies - Using Issue DAO and BO. Maybe using just BO will be better. For that BO needs the issuelist. Nowadays we are using the raw IssueDAO.issues fetched from API. BO is needed to get some data like the mapping issue.state 2 legible text
angular.module('mejoruaSmartphoneAngularApp')
    .service('MapBO', ['$q', 'MapBOExports', 'IssueDAO', 'IssueBO', function($q, MapBOExports, IssueDAO, IssueBO) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var self; //Used to hold "this"
        this.targetScope;

        this.mapFloor2modelFloor = {
            basement: 'PS',
            ground: 'PB',
            first: 'P1',
            second: 'P2',
            third: 'P3',
            fourth: 'P4'
        }

        this.create = function create() {
            var newMap = angular.copy(this);
            newMap.init();
            return newMap;
        }

        this.init = function init($scope) {
            self = this;

            this.targetScope = $scope;

            this.isNotifyMode = false;

            IssueDAO.observer.subscribe("fetch", this.markersUpdate);
            MapBOExports.observer.subscribe("modify-isNotifyMode", this.setModeNotify);

            this.center = {
                lat: 38.383572, // Leaflet map default latitude - Set to University of Alicante
                lng: -0.512019, // Leaflet map default longitude - Set to University of Alicante
                zoom: 16
            }

            this.initTiles();
            this.initLayers();
            this.initIcons();
            this.initMarkers();

            MapBOExports.markerNotify.icon = this.icons.issue.state.PENDING;
        }

        this.initTiles = function initTiles() {

            this.tiles = {};
            this.tiles.background = undefined;
            this.tiles.url = {};
            this.tiles.url.sigua = {};
            this.tiles.url.sigua.background = undefined;
            this.tiles.url.sigua.floor = {};
            this.tiles.url.sigua.floor.basement = {};
            this.tiles.url.sigua.floor.ground = {};
            this.tiles.url.sigua.floor.first = {};
            this.tiles.url.sigua.floor.second = {};
            this.tiles.url.sigua.floor.third = {};
            this.tiles.url.sigua.floor.fourth = {};

            //SIGUA tiles for codes are ignored because right now aren't used
            this.tiles.url.sigua.background = 'http://www.sigua.ua.es/cache/tms/1.0.0/BASE/webmercator_mod/{z}/{x}/{y}.png';

            this.tiles.url.sigua.floor.basement.background = 'http://www.sigua.ua.es/cache/tms/1.0.0/PS_D_TEMA/webmercator_mod/{z}/{x}/{y}.png';
            this.tiles.url.sigua.floor.basement.deno = 'http://www.sigua.ua.es/cache/tms/1.0.0/PS_T_DENO/webmercator_mod/{z}/{x}/{y}.png';
            //this.tiles.url.sigua.floor.basement.codigo = 'http://www.sigua.ua.es/cache/tms/1.0.0/PS_T_CODIGO/webmercator_mod/{z}/{x}/{y}.png';

            this.tiles.url.sigua.floor.ground.background = 'http://www.sigua.ua.es/cache/tms/1.0.0/PB_D_TEMA/webmercator_mod/{z}/{x}/{y}.png';
            this.tiles.url.sigua.floor.ground.deno = 'http://www.sigua.ua.es/cache/tms/1.0.0/PB_T_DENO/webmercator_mod/{z}/{x}/{y}.png';
            //this.tiles.url.sigua.floor.ground.codigo = 'http://www.sigua.ua.es/cache/tms/1.0.0/PB_T_CODIGO/webmercator_mod/{z}/{x}/{y}.png';

            this.tiles.url.sigua.floor.first.background = 'http://www.sigua.ua.es/cache/tms/1.0.0/P1_D_TEMA/webmercator_mod/{z}/{x}/{y}.png';
            this.tiles.url.sigua.floor.first.deno = 'http://www.sigua.ua.es/cache/tms/1.0.0/P1_T_DENO/webmercator_mod/{z}/{x}/{y}.png';
            //this.tiles.url.sigua.floor.first.codigo = 'http://www.sigua.ua.es/cache/tms/1.0.0/P1_T_CODIGO/webmercator_mod/{z}/{x}/{y}.png';

            this.tiles.url.sigua.floor.second.background = 'http://www.sigua.ua.es/cache/tms/1.0.0/P2_D_TEMA/webmercator_mod/{z}/{x}/{y}.png';
            this.tiles.url.sigua.floor.second.deno = 'http://www.sigua.ua.es/cache/tms/1.0.0/P2_T_DENO/webmercator_mod/{z}/{x}/{y}.png';
            //this.tiles.url.sigua.floor.second.codigo = 'http://www.sigua.ua.es/cache/tms/1.0.0/P2_T_CODIGO/webmercator_mod/{z}/{x}/{y}.png';

            this.tiles.url.sigua.floor.third.background = 'http://www.sigua.ua.es/cache/tms/1.0.0/P3_D_TEMA/webmercator_mod/{z}/{x}/{y}.png';
            this.tiles.url.sigua.floor.third.deno = 'http://www.sigua.ua.es/cache/tms/1.0.0/P3_T_DENO/webmercator_mod/{z}/{x}/{y}.png';
            //this.tiles.url.sigua.floor.third.codigo = 'http://www.sigua.ua.es/cache/tms/1.0.0/P3_T_CODIGO/webmercator_mod/{z}/{x}/{y}.png';

            this.tiles.url.sigua.floor.fourth.background = 'http://www.sigua.ua.es/cache/tms/1.0.0/P4_D_TEMA/webmercator_mod/{z}/{x}/{y}.png';
            this.tiles.url.sigua.floor.fourth.deno = 'http://www.sigua.ua.es/cache/tms/1.0.0/P4_T_DENO/webmercator_mod/{z}/{x}/{y}.png';
            //this.tiles.url.sigua.floor.fourth.codigo = 'http://www.sigua.ua.es/cache/tms/1.0.0/P4_T_CODIGO/webmercator_mod/{z}/{x}/{y}.png';

        }

        this.initLayers = function initLayers() {
            var defaultFloor = "ground";
            var floorsArray = ["basement", "ground", "first", "second", "third", "fourth"];
            var floorIndex;
            var floor;

            this.layers = {};
            this.layers.sigua = {};
            this.layers.sigua.background = this.newLayerConfig(this.tiles.url.sigua.background);
            this.layers.sigua.floor = {};

            //Generate layers
            for (floorIndex in floorsArray) {
                floor = floorsArray[floorIndex];
                this.layers.sigua.floor[floor] = {};
                this.layers.sigua.floor[floor].background = this.newLayerConfig(this.tiles.url.sigua.floor[floor].background, true);
                this.layers.sigua.floor[floor].deno = this.newLayerConfig(this.tiles.url.sigua.floor[floor].deno, true);
            }

            //Set active layers shown
            this.layers.active = {};
            this.layers.active.baselayers = {};
            this.layers.active.baselayers.background = this.layers.sigua.background;
            this.layers.active.overlays = {};
            this.setActiveFloorLayer(defaultFloor);
        }

        this.initIcons = function initIcons() {
            var iconSize = [22, 31];

            this.icons = {};
            this.icons.template = {
                //iconSize: iconSize,
                //iconAnchor: [(iconSize[0] / 2), iconSize[1]],
                //popupAnchor: [0, -iconSize[1]]
                type: 'awesomeMarker',
                prefix: 'fa'
            };

            this.icons.issue = {};
            this.icons.issue.state = {};
            this.icons.issue.state.PENDING = angular.copy(this.icons.template);
            //this.icons.issue.state.PENDING.iconUrl = 'images/map/icon_pending.png';
            this.icons.issue.state.INPROGRESS = angular.copy(this.icons.template);
            //this.icons.issue.state.INPROGRESS.iconUrl = 'images/map/icon_inProgress.png';
            this.icons.issue.state.DONE = angular.copy(this.icons.template);
            //this.icons.issue.state.DONE.iconUrl = 'images/map/icon_done.png';

            this.icons.issue.state.PENDING.icon = 'exclamation-triangle';
            this.icons.issue.state.PENDING.markerColor = 'red';
            //this.icons.issue.state.PENDING.extraClasses = 'colorRed';

            this.icons.issue.state.INPROGRESS.icon = 'cog';
            this.icons.issue.state.INPROGRESS.markerColor = 'orange';
            this.icons.issue.state.INPROGRESS.spin = true;
            //this.icons.issue.state.INPROGRESS.extraClasses = 'colorYellow';

            this.icons.issue.state.DONE.icon = 'check';
            this.icons.issue.state.DONE.markerColor = 'green';
        }

        this.initMarkers = function initMarkers() {
            this.markers = {};
            this.markers.active = {};

            if (IssueDAO.issues != undefined) this.markersUpdate(IssueDAO.issues);

        }

        this.markersUpdate = function markersUpdate() {
            var deferred = $q.defer();

            IssueBO.getAll().then(function(issues) {
                console.log("MapBO - markersUpdate() ->  IssueBO.getAll().then() - issues:%O", issues);

                var markers = {};
                var issueBO;
                var remoteIssue;

                if (issues != undefined) {

                    for (var i = 0; i < issues.length; i++) {
                        issueBO = issues[i];
                        remoteIssue = issueBO.models.issue;

                        markers[remoteIssue.idSIGUA] = {
                            //group: "ua",
                            lat: remoteIssue.latitude,
                            lng: remoteIssue.longitude,
                            icon: self.icons.issue.state[remoteIssue.state],
                            message: '<p class="issue state' + remoteIssue.state + '"> ' + issueBO.modelState2viewText[remoteIssue.state] + '<br/>' +
                                remoteIssue.action + '<br/>' +
                                '{{targetTextIndex[' + remoteIssue.id + ']}}<br/>' +
                                '<a href="#/issueDetail/' + remoteIssue.id + '" class="btn btn-xs btn-block">Ver detalles</a>',
                            getMessageScope: function () { 
                                return self.targetScope;
                            },
                            compileMessage: true
                        }
                    }
                }

                self.markers.issues = markers;
                if (!self.isNotifyMode) self.markersShowIssues();

            });

            return deferred.promise;
        }

        this.newLayerConfig = function newLayerConfig(url, isFloor) {
            if (isFloor == undefined) isFloor = false;
            //type: xyz,mapbox,geoJSON,utfGrid,cartodbTiles,cartodbUTFGrid,cartodbInteractive,wms,wmts,wfs,group,featureGroup,google,china,ags,dynamic,markercluster,bing,heatmap,yandex,imageOverlay,custom
            var config = {
                name: url,
                type: 'xyz',

                layerParams: {
                    attribution: 'Datos mapa &copy; <a href="http://www.sigua.ua.es">SIGUA</a>',
                    tms: true,
                    maxZoom: 21,
                    transparent: true,
                    unloadInvisibleTiles: true
                }
            }

            if (isFloor) {
                config.visible = true;
                config.layerParams.minZoom = 19;
            }

            config.url = url;

            return config;
        }

        this.setActiveFloorLayer = function setActiveFloorLayer(floor) {

            this.layers.active.overlays.floorBackground = this.layers.sigua.floor[floor].background;
            this.layers.active.overlays.floorDenomination = this.layers.sigua.floor[floor].deno;

            //Update notify marker active floor
            MapBOExports.markerNotify.data.floor = this.mapFloor2modelFloor[floor];
        }

        this.activeFloorLayerDelete = function activeFloorLayerDelete() {
            delete this.layers.active.overlays.floorBackground;
            delete this.layers.active.overlays.floorDenomination;
        }

        this.setModeNotify = function setModeNotify(shouldModeNotify) {
            if (shouldModeNotify) {
                self.markersShowNotify();
            } else {
                self.markersShowIssues();
            }
        }

        this.markersShowNotify = function markersShowNotify() {
            MapBOExports.markerNotify.lat = this.center.lat;
            MapBOExports.markerNotify.lng = this.center.lng;

            this.markers.issues = this.markers.active;
            this.markers.active = {};
            this.markers.active.notify = MapBOExports.markerNotify;
        }

        this.markersShowIssues = function markersShowIssues() {
            this.markers.active = this.markers.issues;
        }

        //this.init();
    }])
/*
    .factory('MapBOExports.markerNotify', function clientIdFactory() {
        return {
            lat: undefined, //Set on MapBO.markersShowNotify()
            lng: undefined, //Set on MapBO.markersShowNotify()
            icon: undefined, //Set on MapBO.init()
            message: '<p>Drag the marker to the exact location</p>',
            draggable: true,
            data: {} //Holder for active floor, wich is needed to get the SIGUA id (needs floor,lat,lng)
        };
    });
*/
    .service('MapBOExports', ['ObserverService', function(ObserverService) {

        this.init = function init() {
            this.observer = ObserverService.create();
            this.observer.addEvent("modify-isNotifyMode");

            this.isNotifyMode = false;
        }

        /**
         * Shared marker info between IssueMapCtrl and IssueNotifyCtrl
         * 
         * @type {Object}
         */
        this.markerNotify = {
            lat: undefined, //Set on MapBO.markersShowNotify()
            lng: undefined, //Set on MapBO.markersShowNotify()
            icon: undefined, //Set on MapBO.init()
            message: '<p>Drag the marker to the exact location</p>',
            draggable: true,
            data: {} //Holder for active floor, wich is needed to get the SIGUA id (needs floor,lat,lng)
        }     

        this.setIsNotifyMode = function setModeNotify(isMode) {
            this.isNotifyMode = isMode;
            this.observer.notify("modify-isNotifyMode", isMode);
        }

        this.init();
    }]);