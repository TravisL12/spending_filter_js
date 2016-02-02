'use strict';

/**
 * @ngdoc function
 * @name spendingAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the spendingAngularApp
 */
angular.module('spendingAngularApp')
  .controller('MainCtrl', function($scope, allRecords, financeData){

  $scope.monthAbbreviations = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  $scope.searchRecords = {};

  $scope.getNumber = function(num) {
    return new Array(num);
  };

  $scope.selectYear = function() {
    $scope.selectedYear = this.year;
  };

  $scope.highlightActiveDay = function() {
    return $scope.transactionDate === (this.$index + 1) + '/' + (this.$parent.$index + 1);
  };

  $scope.filterPrice = function() {
    financeData.updateFilterAttributes($scope.searchRecords);
    createSpending(financeData.getSpending());
  };

  // Immediately imports a selected CSV
  $scope.$watch('csv.result', function(newVal, oldVal) {
    if (newVal !== oldVal) {
      importCsv();
    }
  });

  $scope.csv = {
    content: null,
    header: true,
    separator: ',',
    result: null
  };

  $scope.getDate = function(month, day) {
    var monthObj = $scope.allRecords[$scope.selectedYear].month[month];
    if (monthObj) {
      if (day) {
        return $scope.allRecords[$scope.selectedYear].month[month].day[day]; // return Day
      }
      return monthObj; // return Month
    }
    return;
  };

  function parseDate(transaction) {
    var re = new RegExp(/((^\d{1,2}|\s\d{1,2})\/\d{2}\s)/);
    var newDate = transaction.description.match(re);
    if (newDate) {
      var date  = new Date(transaction.date);
      var year  = date.getYear() - 100;
      return newDate[0] + '/' + year;
    }
    return transaction.date;
  }

  function importCsv() {
    financeData.resetCategories();
    angular.forEach($scope.csv.result, function(transaction) {
      financeData.buildCategories(transaction.category);
      transaction.date = parseDate(transaction);
      transaction.amount = Number(transaction.amount.replace(/[^0-9\.-]+/g,''));
    });
    $scope.rawSpendingData = financeData.setSpending($scope.csv.result);
    createSpending($scope.csv.result);
  }

  $scope.setMonthStyling = function() {
    var month = $scope.getDate(this.$index + 1);
    if (month) {
        var formatSteps = 12; // number of months, also referenced in CSS
        var maxMonth = 20000;
        var ratio = month.total < maxMonth ? Math.ceil(month.total / maxMonth * formatSteps) : formatSteps;
        return 'month-conditional-' + ratio;
    }
    return 'empty';
  };

  $scope.setDayStyling = function() {
    var month = $scope.getDate(this.$index + 1);
    if (month) {
      var day = $scope.getDate(this.$index + 1, this.$parent.$index + 1);
      if (day) {
        var formatSteps = 15; // Arbitrary number of color gradients, also referenced in CSS
        var maxDay = (3*$scope.searchRecords.priceMax) || 2000;
        var ratio = day.total < maxDay ? Math.ceil(day.total / maxDay * formatSteps) : formatSteps;
        return 'day-conditional-' + ratio;
      }
    }
    return 'empty';
  };

  $scope.showTransactions = function(month, day) {
    month = month || this.$index + 1;
    day   = day   || this.$parent.$index + 1;
    $scope.transactionDate = month + '/' + day;
    $scope.selectedDate    = $scope.getDate(month, day);
  };

  function createSpending(data) {
    $scope.allRecords   = financeData.buildSpendingData(data);
    $scope.categories   = financeData.getCategories();
    $scope.yearRange    = Object.keys($scope.allRecords);
    $scope.selectedYear = $scope.selectedYear || $scope.yearRange[$scope.yearRange.length - 1];
    $scope.showTransactions(1,2);
  }

  if (typeof(financeData.getSpending()) === 'object') {
    $scope.rawSpendingData = financeData.getSpending();
  } else if (!allRecords.error) {
    $scope.rawSpendingData = financeData.setSpending(allRecords.data);
  }
  createSpending($scope.rawSpendingData);

});
