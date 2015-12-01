(function () {

  'use strict';

  require('angular');
  require('angular-route');
  require('angular-animate');
  var mainCtrl = require('./controllers/mainctrl');
  var testCtrl = require('./controllers/testctrl');
  //var ffxivdb = require('./services/xivdb');
  //var g13Service = require('./services/g13');
  
  var app = angular.module('g13KeyMaker', ['ngRoute', 'ngAnimate']);

  app.config([
    '$locationProvider',
    '$routeProvider',
    function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');
      // routes
      $routeProvider
        .when("/", {
          templateUrl: "./partials/partial1.html",
          controller: "MainController"
        })
        .when("/test/", {
          templateUrl: "./partials/test.html",
          controller: "TestController"
        })
        .otherwise({
           redirectTo: '/'
        });
    }
  ]);

  //Load controller
  app.controller('MainController', ['$scope', '$http', '$log', mainCtrl]);
  app.controller('TestController', ['$scope', '$http', '$log', testCtrl]);

}());