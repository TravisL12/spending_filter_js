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
  'ngCsvImport'
  ]).config(function ($routeProvider) {

    $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      controllerAs: 'main',
      resolve: {
        allRecords: function($http) {
          return $http({
            method: 'GET',
            url: 'total_spending.json'
          }).success(function(data) {
            return data;
          });
        }
      }
    })
    .when('/balances', {
      templateUrl: 'views/balances.html',
      controller: 'BalancesCtrl',
      controllerAs: 'balances'
    })
    .when('/spendingGraph', {
      templateUrl: 'views/spendinggraph.html',
      controller: 'SpendinggraphCtrl',
      controllerAs: 'spendingGraph'
    })
    .otherwise({
      redirectTo: '/'
    });
  });