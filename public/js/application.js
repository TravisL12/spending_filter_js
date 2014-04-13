var spendingApp = angular.module('spendingApp', []);

spendingApp.controller('SpendCtrl', ['$scope', '$http', 'filterFilter', function($scope, $http, filterFilter){
  $scope.currentPage = 0;
  $scope.pageSize = 200;

  $scope.$watch('searchRecords', function(data){
    $scope.filter_records = filterFilter($scope.all_records, data)
    if($scope.filter_records){
      $scope.setCurrentPage(0);
      $scope.total_pages = getNumberAsArray(numberOfPages());
    }
  })

  $scope.setCurrentPage = function(currentPage) {
    $scope.currentPage = currentPage;
  }

  function getNumberAsArray(num) {
    return new Array(num);
  };

  function numberOfPages() {
    return Math.ceil($scope.filter_records.length/ $scope.pageSize);
  };

  var httpRequest = $http({
    method: 'GET',
    url: 'total_spending.json'
  }).success(function(data, status) {
    $scope.filter_records = data;
    $scope.all_records = $scope.filter_records;
    $scope.total_pages = getNumberAsArray(numberOfPages());
  });

  $scope.clear_all = function(){
    $scope.searchRecords = '';

    $scope.start_date  = '';
    $scope.end_date    = '';

    $scope.start_price = '';
    $scope.end_price   = '';

    $scope.date_price_range();
  }

  $scope.date_price_range = function(){
    var result = [];

    var start_date = $scope.start_date ? Date.parse($scope.start_date) : 0;
    var end_date   = $scope.end_date   ? Date.parse($scope.end_date)   : Date.now();

    var start_price = $scope.start_price ? $scope.start_price : 0;
    var end_price   = $scope.end_price   ? $scope.end_price   : 100000;

    $.each($scope.all_records, function (index, record){

      var recordDate = Date.parse(record.date);
      if (recordDate >= start_date && recordDate <= end_date){
        if (record.amount >= start_price && record.amount <= end_price){
          result.push(record);
        }
      }
    });

    $scope.filter_records = result;
    $scope.setCurrentPage(0);
    $scope.total_pages = getNumberAsArray(numberOfPages());
  };

}]);

spendingApp.filter('startFrom', function() {
  return function(input, start) {
    if(input){
      return input.slice(start);
    }
  }
});
