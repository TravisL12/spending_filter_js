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

  $scope.getNumber = function(num) {
    return new Array(num);
  };

  $scope.selectYear = function() {
    $scope.selectedYear = this.year;
  };

  $scope.highlightActiveDay = function() {
    return $scope.transactionDate === (this.$index + 1) + '/' + (this.$parent.$index+1);
  };

  // Immediately imports a selected CSV
  $scope.$watch('csv.result', function(newVal, oldVal) {
    if (newVal !== oldVal) {
      importCsv();
    }
  });

  $scope.filterPrice = function() {
    createSpending($scope.rawSpendingData);
  };

  $scope.searchRecords = {
    // ng-model-options
    options: { debounce: 1000 }
  };

  $scope.csv = {
    content: null,
    header: true,
    separator: ',',
    result: null
  };

  function Year() {
    return {
      month: {}
    };
  }

  function Month() {
    return {
      maxDayTotal: 0,
      day: {}
    };
  }

  function Day() {
    return {
      total: 0,
      transactions: []
    };
  }

  function buildCategories(category) {
    if ($scope.categories.indexOf(category) === -1) {
      $scope.categories.push(category);
    }
  }

  function importCsv() {
    $scope.categories = [];
    angular.forEach($scope.csv.result, function(transaction) {
      buildCategories(transaction.category);
      transaction.amount = Number(transaction.amount.replace(/[^0-9\.-]+/g,''));
    });
    $scope.rawSpendingData = $scope.csv.result;
    createSpending($scope.csv.result);
  }

  function setMaxDaymaxDayTotal(month, day) {
    if (month.day[day].total > month.maxDayTotal) {
      month.maxDayTotal = month.day[day].total;
    } 
  }

  function validatePrice(amount) {
    var min = true, max = true;
    if ($scope.searchRecords.priceMin) {
      min = amount >= $scope.searchRecords.priceMin;
    }
    if ($scope.searchRecords.priceMax) {
      max = amount <= $scope.searchRecords.priceMax;
    }
    return min && max;
  }

  function validateCategory(category) {
    if ($scope.searchRecords.category) {
      return category === $scope.searchRecords.category;
    }
    return true;
  }

  function validateDescription(description) {
    if ($scope.searchRecords.description) {
      return description.toLowerCase().indexOf($scope.searchRecords.description.toLowerCase()) > -1;
    }
    return true;
  }

  function validateTransaction(transaction) {
    var price       = validatePrice(transaction.amount);
    var category    = validateCategory(transaction.category);
    var description = validateDescription(transaction.description);

    return price && category && description;
  }

  function buildSpendingData(data) {
    $scope.categories = [];
    var spending = {};
    angular.forEach(data, function(transaction) {
      buildCategories(transaction.category);
      var date  = new Date(transaction.date);
      var year  = date.getYear() + 1900;
      var month = date.getMonth() + 1;
      var day   = date.getDate();

      spending[year]                       = spending[year] || new Year();
      spending[year].month[month]          = spending[year].month[month] || new Month();
      spending[year].month[month].day[day] = spending[year].month[month].day[day] || new Day();

      if (validateTransaction(transaction)) {
        spending[year].month[month].day[day].total += transaction.amount;
        spending[year].month[month].day[day].transactions.push(transaction);
        // Set the max sum within the month
        setMaxDaymaxDayTotal(spending[year].month[month], day);
      }

    });

    return spending;
  }

  $scope.setConditionalFormatting = function() {
    if ($scope.allRecords) {
      var month = $scope.allRecords[$scope.selectedYear].month[this.$index+1];
      if (month) {
        var day = $scope.allRecords[$scope.selectedYear].month[this.$index+1].day[this.$parent.$index+1];
        if (day) {
          var monthMax = month.maxDayTotal;
          var dayTotal = day.total;
          var ratio = Math.ceil(parseFloat(dayTotal / monthMax) * 15);
          return 'conditional-' + ratio;
        }
      }
    }
    return;
  };

  $scope.showTransactions = function(month, day) {
    month = month || this.$index + 1;
    day   = day   || this.$parent.$index+1;
    $scope.transactionDate = month + '/' + day;
    $scope.selectedDate    = $scope.allRecords[$scope.selectedYear].month[month].day[day];
  };

  function createSpending(data) {
    $scope.allRecords    = buildSpendingData(data);
    $scope.yearRange     = Object.keys($scope.allRecords);
    $scope.selectedYear = $scope.selectedYear || $scope.yearRange[$scope.yearRange.length-1];
    $scope.showTransactions(1,2);
  }

  $http({
    method: 'GET',
    url: 'total_spending.json'
  }).success(function(data) {
    $scope.rawSpendingData = data;
    createSpending(data);
  });

});
