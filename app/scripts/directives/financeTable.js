'use strict';

angular.module('spendingAngularApp').directive('financeTable', function () {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/finance_table.html',
    scope: {
      allRecords: '=',
      priceMax: '=',
      showTransactions: '&',
      transactionDate: '='
    },
    link: function (scope) {
        function numberRange (num) {
          return Array.apply(null, {length: num}).map(function (current, index) {
            return index + 1;
          });
        }

        scope.monthAbbreviations = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        scope.dayCount   = numberRange(31);
        scope.monthCount = numberRange(12);

        scope.highlightActiveDay = function() {
          return scope.transactionDate === this.month + '/' + this.day;
        };

        scope.setMonthStyling = function() {
          var month = scope.allRecords.month[this.month];
          var formatSteps = Math.max.apply(null, scope.monthCount); // number of months, also referenced in CSS
          var maxMonth = 20000;
          var ratio = month.total < maxMonth ? Math.ceil(month.total / maxMonth * formatSteps) : formatSteps;
          return 'month-conditional-' + ratio;
        };

        scope.setDayStyling = function() {
          var day = scope.allRecords.month[this.month].day[this.day];
          var formatSteps = 10; // Arbitrary number of color gradients, also referenced in CSS
          var maxDay = (3 * scope.priceMax) || 2000;
          var ratio = day.total < maxDay ? Math.ceil(day.total / maxDay * formatSteps) : formatSteps;
          return 'day-conditional-' + ratio;
        };

    }
  };

});
