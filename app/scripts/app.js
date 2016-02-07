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
      var url = 'https://spreadsheets.google.com/feeds/list/1X05BAK1GSF4rbr-tSPWh2GBFk1zqg3jUPxrDcGivw9s/1/public/values?alt=json';
      return $http.get(url).then(function(data) {
        return data.data.feed.entry.map(function(obj) {
          return {
            category:    obj.gsx$category.$t,
            date:        obj.gsx$date.$t,
            description: obj.gsx$description.$t,
            amount:      obj.gsx$amount.$t
          };
        });
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
