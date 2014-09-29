var spendingApp = angular.module('spendingApp', []);

spendingApp.controller('SpendCtrl', ['$scope', '$http', 'filterFilter', function($scope, $http, filterFilter){

  Array.prototype.max = function() {
    return Math.max.apply(null, this);
  };

  Array.prototype.min = function() {
    return Math.min.apply(null, this);
  };

  $scope.getNumber = function(num) {
    return getNumberAsArray(num);
  }

  var createArray = function(attr, elem){
    items = []
    if(!elem){
      elem = $scope.filter_records;
    }

    for(var i=0; i<elem.length; i++){
      items.push(elem[i][attr])
    }

    return items;
  }

  $scope.$watch('searchRecords', function(data){
    $scope.filter_records = filterFilter($scope.all_records, data)
  })

  function getNumberAsArray(num) {
    return new Array(num);
  };

  var getData = $http({
    method: 'GET',
    url: 'total_spending.json'
  }).success(function(data, status) {
    $scope.filter_records = data;
    $scope.all_records = $scope.filter_records;
    $scope.yearRange = getYears();
    $scope.summedPrices = sumPrices();
  });

  function getYears() {
    var date = new Date($scope.all_records[0].date);
    var minYear = date.getYear() + 1900;
    $scope.defaultYear = minYear;

    var ct = $scope.all_records.length - 1;
    date = new Date($scope.all_records[ct].date);
    var maxYear = date.getYear() + 1900;

    var years = [];
    for (var i=minYear; i <= maxYear; i++ ) {
      years.push(i);
    }
    return years;
  }

  $scope.clear_all = function(){
    $scope.searchRecords = '';

    $scope.start_date  = '';
    $scope.end_date    = '';

    $scope.start_price = '';
    $scope.end_price   = '';

    $scope.datePriceRange();
  }

  $scope.showDate = function(month, day, year) {
    $scope.currentDate = true;
    if (year == undefined) { year = $scope.yearRange.min(); }
    var date = month + '/' + day + '/' + year;
    $scope.datePriceRange(date);
  }

  function sumPrices() {
    var sums = {};
    for (var i=$scope.yearRange.min(); i <= $scope.yearRange.max(); i++) {
      if (sums[i] == undefined) { sums[i] = {}; }

      for (var j=1; j <= 12; j++) {
        if (sums[i][j] == undefined) { sums[i][j] = {}; }

        for (var k=1; k <= 31; k++) {
          if (sums[i][j][k] == undefined) { sums[i][j][k] = 0; }

          var sum = priceSum(j, k, i);
          sums[i][j][k] = sum;
        }
      }
    }
    return sums;
  }

  function priceSum(month, day, year) {
    var sum = 0;
    var date = Date.parse(month + '/' + day + '/' + year);

    angular.forEach($scope.all_records, function(record) {
      if(date == Date.parse(record.date) ) {
        sum += record.amount;
      }
    })

    return sum;
  }

  $scope.datePriceRange = function(date){
    var result = [];

    var date = Date.parse(date);

    $.each($scope.all_records, function (index, record){
      var recordDate = Date.parse(record.date);
      if (recordDate >= date && recordDate <= date){
        result.push(record);
      }
    });

    $scope.filter_records = result;
  };

}]);

spendingApp.filter('startFrom', function() {
  return function(input, start) {
    if(input){
      return input.slice(start);
    }
  }
});
