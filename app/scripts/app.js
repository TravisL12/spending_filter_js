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
    .otherwise({
      redirectTo: '/'
    });
  });