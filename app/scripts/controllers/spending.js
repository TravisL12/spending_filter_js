'use strict';

/**
 * @ngdoc function
 * @name spendingAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the spendingAngularApp
 */
angular.module('spendingAngularApp')
  .controller('SpendingCtrl', function($scope, Transactions, compileFinances, $stateParams){

  $scope.searchRecords = compileFinances.searchRecords;
  $scope.description = null;
  $scope.yearPrevBtnDisabled = false;
  $scope.yearNextBtnDisabled = true;
  $scope.categoryTotalMin = 500;

  $scope.nextYear = function (num) {
    var year = {year: $scope.selectedYear + num};
    $scope.selectYear.call(year);
  };

  $scope.selectYear = function() {
    $scope.selectedYear = this.year;
    $scope.yearPrevBtnDisabled = $scope.selectedYear - 1 < 2003;
    $scope.yearNextBtnDisabled = $scope.selectedYear + 1 > 2017;
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

  $scope.singleCategoryChoice = function () {
    $scope.toggleCategories(false);
    this.category.value = true;
    $scope.filterPrice();
  };

  $scope.filterPrice = function() {
    compileFinances.categories = $scope.categories;
    compileFinances.searchRecords = $scope.searchRecords;
    $scope.updateData();
  };

  $scope.showTransactions = function(month, day) {
    $scope.transactionDate = month + '/' + day;
    $scope.selectedDate    = $scope.allRecords.month[month].day[day];
  };

  $scope.updateSpending = function () {
    $scope.categories   = compileFinances.categories;
    $scope.yearRange    = Object.keys(compileFinances.spending).map(function (year) { return parseInt(year); });
    $scope.selectedYear = $scope.selectedYear || $scope.yearRange[$scope.yearRange.length - 1];
    $scope.allRecords   = compileFinances.yearSpending($scope.selectedYear);
    $scope.showTransactions(1,1);
  };

  $scope.updateBalances = function () {
    $scope.yearRange    = Object.keys(compileFinances.balances).map(function (year) { return parseInt(year); });
    $scope.selectedYear = $scope.selectedYear || $scope.yearRange[$scope.yearRange.length - 1];
    $scope.allRecords   = compileFinances.balances[$scope.selectedYear];
  };

  $scope.toggleCategories = function (boolVal) {
    angular.forEach($scope.categories, function (category) {
      category.value = boolVal;
    });

    $scope.filterPrice();
  };

  function maxCategoryTotal() {
    var categories = this.categories;
    var totals = Object.keys(categories).map(function(name) {
      return categories[name].value ? categories[name].total : 0;
    });
    return Math.max.apply(null, totals);
  }

  $scope.setCategoryStyling = function() {
    var category = this.category;
    if (category.total === 0) { return; }
    var formatSteps = 10; // Arbitrary number of color gradients, also referenced in CSS
    var maxCategory = maxCategoryTotal.call(this);
    var ratio = category.total < maxCategory ? Math.ceil(category.total / maxCategory * formatSteps) : formatSteps;
    return 'day-conditional-' + ratio;
  };

  $scope.clearFilters = function () {
    $scope.searchRecords = compileFinances.searchRecords;
    $scope.filterPrice();
  };

  $scope.updateData = function () {
    if ($scope.spendingType === 'spending') {
      $scope.updateSpending();
    } else if ($scope.spendingType === 'balances') {
      $scope.updateBalances();
    }
  };

  $scope.spendingType = $stateParams.spendingType || 'spending';
  $scope.updateData();

});
