'use strict';

angular.module('spendingAngularApp').directive('financeTable', function ($document) {

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

        scope.dateAbbreviation = function () {
          return new Date(this.month +'/1/2016');
        };

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

        $document.keydown(function(e) {
          scope.navigateTransactions(e);
        });

        scope.navigateTransactions = function(event) {
          var code  = event.keyCode;
          var month = parseInt(scope.transactionDate.split('/')[0]);
          var day   = parseInt(scope.transactionDate.split('/')[1]);

          // Navigate by keyCodes: tab (9), return (13), arrows: left(37), up(38), right(39), down(40)
          var navKeyCodes = [9, 13, 37, 38, 39, 40];
          if (navKeyCodes.indexOf(code) !== -1) {
              event.preventDefault();

              // Tab right
              if (code === 9 && month < 12) {
                scope.showTransactions({month: month + 1, day: day});
              }
              // Right arrow
              if (code === 39 && month < 12) {
                scope.showTransactions({month: month + 1, day: day});
              }
              // Shift-Tab left
              if ((event.shiftKey && code === 9) && month > 1) {
                scope.showTransactions({month: month - 1, day: day});
              }
               // Left arrow
              if (code === 37 && month > 1) {
                scope.showTransactions({month: month - 1, day: day});
              }
              // Return or down arrow pressed move 1 box down
              if ((code === 13 || code === 40) && day < 31) {
                scope.showTransactions({month: month, day: day + 1});
              }
              // Shift-Return or up arrow pressed move 1 box up
              if (((event.shiftKey && code === 13) || code === 38) && day > 1) {
                scope.showTransactions({month: month, day: day - 1});
              }
              scope.$apply();
            }
        };


    }
  };

});
