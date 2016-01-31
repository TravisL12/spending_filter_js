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

  function buildSpendingData(data) {
    var totalSpending = {};
    angular.forEach(data, function(transaction) {
      var date  = new Date(transaction.date);
      var year  = date.getYear() + 1900;
      var month = date.getMonth() + 1;
      var day   = date.getDate();

      totalSpending[year]             = totalSpending[year] || {};
      totalSpending[year][month]      = totalSpending[year][month] || {};
      totalSpending[year][month][day] = totalSpending[year][month][day] || {total:0, transactions:[]};

      totalSpending[year][month][day].total += transaction.amount;
      totalSpending[year][month][day].transactions.push(transaction);
    });

    return totalSpending;
  }

  $scope.getNumber = function(num) {
    return new Array(num);
  };

  $scope.showTransactions = function(month, day) {
    var year = $scope.selectedYear;
    month = month || this.$index + 1;
    day   = day   || this.$parent.$index+1;
    $scope.transactionDate = month + '/' + day + '/' + year;
    $scope.listedTransactions = $scope.allRecords[year][month][day].transactions;
  };

  $scope.datePriceRange = function(date){
    var result = [];

    date = Date.parse(date);

    angular.forEach($scope.allRecords, function (record){
      var recordDate = Date.parse(record.date);
      if (recordDate >= date && recordDate <= date){
        result.push(record);
      }
    });

    $scope.listedTransactions = result;
  };

  $http({
    method: 'GET',
    url: 'total_spending.json'
  }).success(function(data) {
    $scope.allRecords    = buildSpendingData(data);
    $scope.yearRange     = Object.keys($scope.allRecords);
    $scope.selectedYear = $scope.yearRange[$scope.yearRange.length-1];
    $scope.showTransactions(1,2);
  });

});
