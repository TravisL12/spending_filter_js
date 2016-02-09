'use strict';

/**
 * @ngdoc function
 * @name spendingAngularApp.controller:BalancesCtrl
 * @description
 * # BalancesCtrl
 * Controller of the spendingAngularApp
 */
angular.module('spendingAngularApp')
  .controller('BalancesCtrl', function ($scope, Balances) {
    $scope.balances = Balances;

    $scope.calcTotal = function() {
      var saving = parseFloat(this.balance.saving) || 0;
      return parseFloat(this.balance.checking) + saving;
    };
  });
