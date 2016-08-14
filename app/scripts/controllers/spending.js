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

  $scope.searchRecords = {};

  $scope.nextYear = function (num) {
    var year = {year: parseInt($scope.selectedYear) + num};
    $scope.selectYear.call(year);
  };

  $scope.selectYear = function() {
    $scope.selectedYear = this.year;
    updateSpending();
  };

  $scope.filterPrice = function() {
    finances.categories = $scope.categories;
    finances.searchRecords = $scope.searchRecords;
    updateSpending();
  };

  $scope.showTransactions = function(month, day) {
    $scope.transactionDate = month + '/' + day;
    $scope.selectedDate    = $scope.allRecords.month[month].day[day];
  };

  function updateSpending() {
    $scope.categories   = finances.categories;
    $scope.yearRange    = Object.keys(finances.spending);
    $scope.selectedYear = $scope.selectedYear || $scope.yearRange[$scope.yearRange.length - 1];
    $scope.allRecords   = finances.yearSpending($scope.selectedYear);
    $scope.showTransactions(1,1);
  }

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

  updateSpending();

});
