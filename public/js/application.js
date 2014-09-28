var spendingApp = angular.module('spendingApp', []);

spendingApp.controller('SpendCtrl', ['$scope', '$http', 'filterFilter', function($scope, $http, filterFilter){

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
  });

  function getYears() {
    var date = new Date($scope.all_records[0].date);
    var minYear = date.getYear() + 1900;

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
    if (year == undefined) { year = '2014'; }
    var date = month + '/' + day + '/' + year;
    $scope.datePriceRange(date);
  }

  $scope.priceSum = function(date) {
    // GET SUMS TO WORK!!!!!!!!!!!!!
    var start_price = $scope.start_price ? $scope.start_price : 0;
    var end_price   = $scope.end_price   ? $scope.end_price   : 100000;

    if (record.amount >= start_price && record.amount <= end_price){
      result.push(record);
    }
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
