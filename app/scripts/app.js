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
          return $http.get(url).then(function(response) {
            compileFinances.spending = response.data.spending.map(function(obj) {
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

          return $http.get(url).then(function(response) {
            for (var i in response.data.balances) {
              var obj    = response.data.balances[i];
              var date   = obj.date.slice(0,10);
              var amount = obj.amount / 100;

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
                  balances[date].oldchecking = amount;
                  break;
                case 'checking':
                  balances[date].checking = amount;
                  break;
                case 'nanny':
                  balances[date].nanny = amount;
                  break;
                case 'savings':
                  balances[date].savings = amount;
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
