(function () {

  'use strict';

  require('angular');
  require('angular-route');
  require('angular-animate');
  var mainCtrl = require('./controllers/mainctrl');
  var testCtrl = require('./controllers/testctrl');
  var ffxivdb = require('./services/xivdb');
  var g13 = require('./services/g13');
  
  var app = angular.module('g13KeyMaker', ['ngRoute', 'ngAnimate']);

  app.config(function($routeProvider) {
      // routes
      $routeProvider
        .when('/', {
          templateUrl: './partials/partial1.html',
          controller: 'mainController'
        })
        .otherwise({
           redirectTo: '/'
        });
  });

  app.service('ffxivdb', ['$http', ffxivdb]);
  app.service('g13', ['$http', g13]);

  //Load controller
  app.controller('mainController', ['$scope', '$http', '$log', 'ffxivdb', 'g13', mainCtrl]);

}());