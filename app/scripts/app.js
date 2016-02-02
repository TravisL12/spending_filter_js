'use strict';

/**
 * @ngdoc overview
 * @name spendingAngularApp
 * @description
 * # spendingAngularApp
 *
 * Main module of the application.
 */
 angular.module('spendingAngularApp', [
  'ngCookies',
  'ngRoute',
  'ngSanitize',
  'ngCsvImport',
  'nvd3'
  ]).config(function ($routeProvider) {

    function defaultRecords($http) {
      return $http({
        method: 'GET',
        url: 'total_spending.json'
      }).success(function(data) {
        return data;
      });
    }

    $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      controllerAs: 'main',
      resolve: {
        allRecords: function($http) {
          return defaultRecords($http);
        }
      }
    })
    .when('/graph', {
      templateUrl: 'views/spendinggraph.html',
      controller: 'SpendinggraphCtrl',
      controllerAs: 'spendingGraph',
      resolve: {
        allRecords: function($http) {
          return defaultRecords($http);
        }
      }
    })
    .when('/balances', {
      templateUrl: 'views/balances.html',
      controller: 'BalancesCtrl',
      controllerAs: 'balances'
    })
    .otherwise({
      redirectTo: '/'
    });
  });