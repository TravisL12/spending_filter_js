'use strict';

/**
 * @ngdoc function
 * @name spendingAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the spendingAngularApp
 */
angular.module('spendingAngularApp')
  .controller('MainCtrl', function($scope, $http){

  $scope.dateTotals  = {};

  $scope.getNumber = function(num) {
    return new Array(num);
  };

  $scope.csv = {
    content: null,
    header: true,
    separator: ',',
    result: null
  };

  function Day() {
    return {
      total: 0,
      transactions: []
    };
  }

  $scope.importCSV = function() {
    angular.forEach($scope.csv.result, function(record) {
      record.amount = parseFloat(record.amount);
    });

    createSpending($scope.csv.result);
  };

  function buildSpendingData(data) {
    var totalSpending = {};
    angular.forEach(data, function(transaction) {
      var date  = new Date(transaction.date);
      var year  = date.getYear() + 1900;
      var month = date.getMonth() + 1;
      var day   = date.getDate();

      totalSpending[year]             = totalSpending[year] || {};
      totalSpending[year][month]      = totalSpending[year][month] || {};
      totalSpending[year][month][day] = totalSpending[year][month][day] || new Day();

      totalSpending[year][month][day].total += transaction.amount;
      totalSpending[year][month][day].transactions.push(transaction);
    });

    return totalSpending;
  }

  $scope.highlightActiveDay = function() {
    return $scope.transactionDate === (this.$index + 1) + '/' + (this.$parent.$index+1);
  };

  $scope.showTransactions = function(month, day) {
    month = month || this.$index + 1;
    day   = day   || this.$parent.$index+1;
    $scope.transactionDate = month + '/' + day;
    $scope.selectedDate    = $scope.allRecords[$scope.selectedYear][month][day];
  };

  function createSpending(data) {
    $scope.allRecords    = buildSpendingData(data);
    $scope.yearRange     = Object.keys($scope.allRecords);
    $scope.selectedYear = $scope.yearRange[$scope.yearRange.length-1];
    $scope.showTransactions(1,2);
  }

  $http({
    method: 'GET',
    url: 'total_spending.json'
  }).success(function(data) {
    createSpending(data);
  });

});
