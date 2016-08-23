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
                description: obj.gsx$payee.$t || obj.gsx$description.$t,
                amount:      obj.gsx$amount.$t
              };
            });
          });
        },
        Balances: function($http, finances) {
          var url = getGoogleUrl(3);
          var balances = {};

          function buildBalance (date) {
            if (!balances[date]) {
              balances[date] = {
                oldchecking: null,
                checking:    null,
                nanny:       null,
                savings:     null
              };
            }
          }

          function parseReplaceAmount (amount) {
            return parseFloat(amount.replace(/[\$,]/g,''));
          }

          return $http.get(url).then(function(data) {
            for (var i in data.data.feed.entry) {
              var obj = data.data.feed.entry[i];

              buildBalance(obj.gsx$date.$t);
              buildBalance(obj.gsx$date_2.$t);
              buildBalance(obj.gsx$date_3.$t);
              buildBalance(obj.gsx$date_4.$t);

              balances[obj.gsx$date.$t].oldchecking = parseReplaceAmount(obj.gsx$oldchecking.$t);
              balances[obj.gsx$date_2.$t].checking  = parseReplaceAmount(obj.gsx$checking.$t);
              balances[obj.gsx$date_3.$t].nanny     = parseReplaceAmount(obj.gsx$nanny.$t);
              balances[obj.gsx$date_4.$t].savings   = parseReplaceAmount(obj.gsx$savings.$t);
            }

            finances.balances = balances;
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
