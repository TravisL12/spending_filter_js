var spendingApp = angular.module('spendingApp', []);

spendingApp.controller('SpendCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter){

  var httpRequest = $http({
    method: 'GET',
    url: 'total_spending_small.json'
  }).success(function(data, status) {
    $scope.filter_records = data;
    $scope.all_records = $scope.filter_records;
  });

  $scope.clear_all = function(){
    $scope.start_date = '';
    $scope.end_date = '';
    $scope.start_price = '';
    $scope.end_price = '';
    $scope.other_view_range();
  }

  $scope.other_view_range = function(){
    var result = [];

    var start_date = $scope.start_date ? Date.parse($scope.start_date) : 0;
    var end_date = $scope.end_date ? Date.parse($scope.end_date) : Date.now();

    var start_price = $scope.start_price ? $scope.start_price : 0;
    var end_price = $scope.end_price ? $scope.end_price : 10000;

    $.each($scope.all_records, function (index, record){

      var recordDate = Date.parse(record.date);
      if (recordDate >= start_date && recordDate <= end_date){
        if (record.amount >= start_price && record.amount <= end_price){
          result.push(record);
        }
      }
    });
    $scope.filter_records = result;
  };

}]);

// Old date filtering
// $scope.view_range = function(record){
//   var start_date = $scope.start_date ? Date.parse($scope.start_date) : 0;
//   var end_date = $scope.end_date ? Date.parse($scope.end_date) : Date.now();

//   var recordDate = Date.parse(record.date);
//   if (recordDate >= start_date && recordDate <= end_date){
//     return true;
//   }else{
//     return false;
//   }
// }