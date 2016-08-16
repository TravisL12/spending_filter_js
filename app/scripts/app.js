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
  ]).config(function ($stateProvider, $urlRouterProvider) {
    function getGoogleUrl(sheetId) {
      return 'https://spreadsheets.google.com/feeds/list/1X05BAK1GSF4rbr-tSPWh2GBFk1zqg3jUPxrDcGivw9s/' + sheetId + '/public/values?alt=json';
    }

    // $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('spreadsheet', {
      url: '',
      template: '<ui-view></ui-view>',
      abstract: true,
      resolve: {
        Transactions: function($http, finances) {
          var url = getGoogleUrl(1);
          return $http.get(url).then(function(data) {
            finances.spending = data.data.feed.entry.map(function(obj) {
              return {
                category:    obj.gsx$subcategory.$t || obj.gsx$category.$t,
                date:        obj.gsx$date.$t,
                description: obj.gsx$description.$t,
                amount:      obj.gsx$amount.$t
              };
            });
          });
        },
        Balances: function($http, finances) {
          var url = getGoogleUrl(2);
          return $http.get(url).then(function(data) {
            finances.balances = data.data.feed.entry.map(function(obj) {
              return {
                date:     obj.gsx$date.$t,
                checking: obj.gsx$checking.$t,
                saving:   obj.gsx$saving.$t
              };
            });
          });
        },
        NewBalances: function($http) {
          var url = getGoogleUrl(3);
          return $http.get(url).then(function(data) {
            return data.data.feed.entry.map(function(obj) {
              return {
                date1:    obj.gsx$date.$t,
                checking: obj.gsx$checking.$t,

                date2:       obj.gsx$date_2.$t,
                oldchecking: obj.gsx$oldchecking.$t,

                date3: obj.gsx$date_3.$t,
                nanny: obj.gsx$nanny.$t,

                date4:   obj.gsx$date_4.$t,
                savings: obj.gsx$savings.$t
              };
            });
          });
        }
      }
    })
    .state('spreadsheet.spending', {
      url:'/',
      templateUrl: 'views/spending.html',
      controller: 'SpendingCtrl'
    })
    .state('spreadsheet.graphs', {
      url: '/graph',
      templateUrl: 'views/graph.html',
      controller: 'SpendinggraphCtrl'
    });
  });
