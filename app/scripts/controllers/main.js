'use strict';

/**
 * @ngdoc function
 * @name spendingAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the spendingAngularApp
 */
angular.module('spendingAngularApp')
  .controller('MainCtrl', function($scope, $http, filterFilter){
  Array.prototype.max = function() {
    return Math.max.apply(null, this);
  };

  Array.prototype.min = function() {
    return Math.min.apply(null, this);
  };

  $scope.getNumber = function(num) {
    return new Array(num);
  };

  $scope.$watch('searchRecords', function(data){
    $scope.filterRecords = filterFilter($scope.allRecords, data);
  });

  $http({
    method: 'GET',
    url: 'total_spending.json'
  }).success(function(data) {
    $scope.filterRecords = data;
    $scope.allRecords    = $scope.filterRecords;
    $scope.yearRange      = getYears();
    $scope.summedPrices   = {};
    $scope.sumPrices($scope.yearRange.max());
  });

  function getYears() {
    var date = new Date($scope.allRecords[0].date);
    var minYear = date.getYear() + 1900;

    var ct = $scope.allRecords.length - 1;
    date = new Date($scope.allRecords[ct].date);
    var maxYear = date.getYear() + 1900;
    $scope.defaultYear = maxYear;

    var years = [];
    for (var i=minYear; i <= maxYear; i++ ) {
      years.push(i);
    }
    return years;
  }

  $scope.clearAll = function(){
    $scope.searchRecords = '';
    $scope.priceStart = '';
    $scope.priceEnd   = '';

    $scope.datePriceRange();
  };

  $scope.showDate = function(month, day, year) {
    $scope.currentDate = true;
    if (year === undefined) { year = $scope.yearRange.min(); }
    var date = month + '/' + day + '/' + year;
    $scope.datePriceRange(date);
  };

  $scope.sumPrices = function(year) {
    if (!$scope.summedPrices[year]){
      for (var i=year; i < (year+1); i++) {
        if ($scope.summedPrices[i] === undefined) { $scope.summedPrices[i] = {}; }

        for (var j=1; j <= 12; j++) {
          if ($scope.summedPrices[i][j] === undefined) { $scope.summedPrices[i][j] = {}; }

          for (var k=1; k <= 31; k++) {
            if ($scope.summedPrices[i][j][k] === undefined) { $scope.summedPrices[i][j][k] = 0; }

            var sum = priceSum(j, k, i);
            $scope.summedPrices[i][j][k] = sum;
          }
        }
      }
    }
  };

  function priceSum(month, day, year) {
    var sum = 0;
    var date = Date.parse(month + '/' + day + '/' + year);

    angular.forEach($scope.allRecords, function(record) {
      if(date === Date.parse(record.date) ) {
        sum += record.amount;
      }
    });

    return sum;
  }

  $scope.datePriceRange = function(date){
    var result = [];

    date = Date.parse(date);

    angular.forEach($scope.allRecords, function (record){
      var recordDate = Date.parse(record.date);
      if (recordDate >= date && recordDate <= date){
        result.push(record);
      }
    });

    $scope.filterRecords = result;
  };

});
