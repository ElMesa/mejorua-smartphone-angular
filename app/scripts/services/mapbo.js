'use strict';

/**
 * @ngdoc service
 * @name mejoruaSmartphoneAngularApp.MapBO
 * @description
 * # MapBO
 * Service in the mejoruaSmartphoneAngularApp.
 */
angular.module('mejoruaSmartphoneAngularApp')
    .service('MapBO', function() {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var self; //Used to hold "this"

        this.create = function create() {
            var newMap = angular.copy(this);
            newMap.init();
            return newMap;
        }
        
        this.init = function init() {
            self = this;

            this.center = {
                lat: 38.383572, // Leaflet map default latitude - Set to University of Alicante
                lng: -0.512019, // Leaflet map default longitude - Set to University of Alicante
                zoom: 16
            }

            this.initTiles();
            this.initLayers();
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
        }

        this.activeFloorLayerDelete = function activeFloorLayerDelete(){
        	delete this.layers.active.overlays.floorBackground;
            delete this.layers.active.overlays.floorDenomination;
        }

        this.init();
    });