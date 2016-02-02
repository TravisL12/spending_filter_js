'use strict';

/**
 * @ngdoc service
 * @name spendingAngularApp.financeData
 * @description
 * # financeData
 * Factory in the spendingAngularApp.
 */
angular.module('spendingAngularApp')
  .factory('financeData', function () {

    var spendingData;

    return {
      setSpending: function (data) {
        spendingData = data;
        return this.getSpending();
      },

      getSpending: function() {
        return spendingData;
      }
    };
  });
