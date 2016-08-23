'use strict';

/**
 * @ngdoc function
 * @name spendingAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the spendingAngularApp
 */
angular.module('spendingAngularApp')
  .controller('SpendingCtrl', function($scope, Transactions, finances){

  $scope.searchRecords = finances.searchRecords;
  $scope.description = null;
  $scope.yearPrevBtnDisabled = false;
  $scope.yearNextBtnDisabled = true;

  $scope.nextYear = function (num) {
    var year = {year: parseInt($scope.selectedYear) + num};
    $scope.selectYear.call(year);
  };

  $scope.selectYear = function() {
    $scope.selectedYear = this.year;
    $scope.yearPrevBtnDisabled = parseInt($scope.selectedYear) - 1 < 2003;
    $scope.yearNextBtnDisabled = parseInt($scope.selectedYear) + 1 > 2016;
    $scope.updateData();
  };

  $scope.addDescriptionFilter = function () {
    $scope.searchRecords.description.push($scope.description);
    $scope.description = null;
    $scope.filterPrice();
  };

  $scope.removeDescription = function () {
    $scope.searchRecords.description.splice(this.$index, 1);
    $scope.filterPrice();
  };

  $scope.filterPrice = function() {
    finances.categories = $scope.categories;
    finances.searchRecords = $scope.searchRecords;
    $scope.updateData();
  };

  $scope.showTransactions = function(month, day) {
    $scope.transactionDate = month + '/' + day;
    $scope.selectedDate    = $scope.allRecords.month[month].day[day];
  };

  $scope.updateSpending = function () {
    $scope.categories   = finances.categories;
    $scope.yearRange    = Object.keys(finances.spending);
    $scope.selectedYear = $scope.selectedYear || $scope.yearRange[$scope.yearRange.length - 1];
    $scope.allRecords   = finances.yearSpending($scope.selectedYear);
    $scope.showTransactions(1,1);
  };

  $scope.updateBalances = function () {
    $scope.yearRange    = Object.keys(finances.balances);
    $scope.selectedYear = $scope.selectedYear || $scope.yearRange[$scope.yearRange.length - 1];
    $scope.allRecords   = finances.balances[$scope.selectedYear];
  };

  $scope.toggleCategories = function (boolVal) {
    angular.forEach($scope.categories, function (category) {
      $scope.categories[category.name].value = boolVal;
    });

    $scope.filterPrice();
  };

  $scope.clearFilters = function () {
    $scope.searchRecords = finances.searchRecords;
    $scope.filterPrice();
  };

  $scope.updateData = function () {
    if ($scope.financeType === 'spending') {
      $scope.updateSpending();
    } else if ($scope.financeType === 'balances') {
      $scope.updateBalances();
    }
  };

  $scope.financeType = 'spending';
  $scope.updateData();

});
