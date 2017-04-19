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
        Transactions: function($http, compileFinances) {
          var url = 'http://0.0.0.0:4000/spending';
          return $http.get(url).then(function(data) {
            compileFinances.spending = data.data.spending.map(function(obj) {
              return {
                category:    obj.subcategory || obj.category,
                date:        obj.date,
                description: obj.payee || obj.description,
                amount:      obj.amount / 100
              };
            });
          });
        },
        Balances: function($http, compileFinances) {
          var url = 'http://0.0.0.0:4000/balances';
          var balances = {};

          return $http.get(url).then(function(data) {
            for (var i in data.data.balances) {
              var obj = data.data.balances[i];
              var date = obj.date.slice(0,10);

              if (!balances[date]) {
                balances[date] = {
                  oldchecking: null,
                  checking:    null,
                  nanny:       null,
                  savings:     null
                };
              }

              switch (obj.category) {
                case 'old checking':
                  balances[date].oldchecking = obj.amount / 1000;
                  break;
                case 'checking':
                  balances[date].checking = obj.amount / 1000;
                  break;
                case 'nanny':
                  balances[date].nanny     = obj.amount / 1000;
                  break;
                case 'savings':
                  balances[date].savings   = obj.amount / 1000;
                  break;
              }

            }

            compileFinances.balances = balances;
          });
        }
      }
    })
    .state('spreadsheet.spending', {
      url:'/:spendingType',
      templateUrl: 'views/spending.html',
      controller: 'SpendingCtrl'
    })
    .state('spreadsheet.graphs', {
      url: '/graph',
      templateUrl: 'views/graph.html',
      controller: 'SpendinggraphCtrl'
    });
  });
