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
  'ui.router',
  'nvd3'
  ]).config(function ($stateProvider) {

    function getGoogleUrl(num) {
      return 'https://spreadsheets.google.com/feeds/list/1X05BAK1GSF4rbr-tSPWh2GBFk1zqg3jUPxrDcGivw9s/' + num + '/public/values?alt=json';
    }

    function getTransactions($http) {
      var url = getGoogleUrl(1);
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

    function getBalances($http) {
      var url = getGoogleUrl(2);
      return $http.get(url).then(function(data) {
        return data.data.feed.entry.map(function(obj) {
          return {
            date:     obj.gsx$date.$t,
            checking: obj.gsx$checking.$t,
            saving:   obj.gsx$saving.$t
          };
        });
      });
    }

    $stateProvider
    .state('spreadsheet', {
      url: '',
      template: '<ui-view></ui-view>',
      abstract: true,
      resolve: {
        Transactions: function($http) {
          return getTransactions($http);
        },
        Balances: function($http) {
          return getBalances($http);
        }
      }
    })
    .state('spreadsheet.spending', {
      url:'/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .state('spreadsheet.graphs', {
      url: '/graph',
      templateUrl: 'views/spendinggraph.html',
      controller: 'SpendinggraphCtrl'
    })
    .state('spreadsheet.balances', {
      url: '/balances',
      templateUrl: 'views/balances.html',
      controller: 'BalancesCtrl'
    });
  });
