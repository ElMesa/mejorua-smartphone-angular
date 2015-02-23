'use strict';

/**
 * @ngdoc function
 * @name mejoruaSmartphoneAngularApp.controller:IssuemapCtrl
 * @description
 * # IssuemapCtrl
 * Controller of the mejoruaSmartphoneAngularApp
 */
angular.module('mejoruaSmartphoneAngularApp')
    .controller('IssuemapCtrl', function($scope) {

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
        
        $scope.map = {};
        $scope.map.controls = {};
        $scope.map.center = {
                lat: 38.383572, // Leaflet map default latitude - Set to University of Alicante
                lng: -0.512019, // Leaflet map default longitude - Set to University of Alicante
                zoom: 16
            }

        var URLSigua = "http://www.sigua.ua.es/cache/tms/1.0.0/BASE/webmercator_mod/{z}/{x}/{y}.png";
        var URLOSM = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        var background = newLayerConfig(this.tiles.url.sigua.background);
        var floorBackground =  newLayerConfig(this.tiles.url.sigua.floor.ground.background, true);
        var floorDenomination = newLayerConfig(this.tiles.url.sigua.floor.ground.deno, true);

        //this.tiles.url.sigua.floor.basement.background
        //this.tiles.url.sigua.floor.basement.deno

        $scope.map.layers = {};
        $scope.map.layers.baselayers = {};
        $scope.map.layers.baselayers.background = background;
        $scope.map.layers.overlays = {};
        $scope.map.layers.overlays.floorBackground = floorBackground;
        $scope.map.layers.overlays.floorDenomination = floorDenomination;

        function newLayerConfig(url, isFloor) {
            if(isFloor == undefined) isFloor = false;
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

            if(isFloor) {
                config.visible = true;
                config.layerParams.minZoom = 19;
            }

            config.url = url;

            return config;
        }
    });