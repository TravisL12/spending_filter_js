'use strict';

/**
 * @ngdoc function
 * @name spendingAngularApp.controller:SpendinggraphCtrl
 * @description
 * # SpendinggraphCtrl
 * Controller of the spendingAngularApp
 */
angular.module('spendingAngularApp')
  .controller('SpendinggraphCtrl', function ($scope, finances, Transactions) {

    var rawSpendingData;

    if (typeof(finances.getSpending()) === 'object') {
      rawSpendingData = finances.getSpending();
    } else if (!Transactions.error) {
      rawSpendingData = finances.setSpending(Transactions.data);
    }

    $scope.chartOptions = {
      chart: {
        type: 'lineChart',
        height: 600,
        showLegend: false,
        margin : {
          top: 20,
          right: 20,
          bottom: 100,
          left: 60
        },
        x: function(d){
          return new Date(d.x);
        },
        y: function(d){
          return d.y;
        },
        useInteractiveGuideline: true,
        xScale : window.d3.time.scale.utc(),
        xAxis: {
          axisLabel: 'Dates',
          rotateLabels: -90,
          tickFormat: function(d) {
            return window.d3.time.format('%m-%d-%y')(d);
          }
        },
        yAxis: {
          axisLabel: 'Total ($)',
          tickFormat: function(d){
            return window.d3.format('$,0f')(d);
          }
        }
      },
      title: {},
      subtitle: {},
      caption: {}
    };

    $scope.data = [{ key: 'Spending', values: [] }];

    for(var i = 0; i < rawSpendingData.length; i++) {
      if (rawSpendingData[i].amount > 0) {
        $scope.data[0].values.push({ x: rawSpendingData[i].date, y: rawSpendingData[i].amount });
      }
    }

  });
