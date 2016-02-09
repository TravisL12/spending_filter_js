'use strict';

/**
 * @ngdoc service
 * @name spendingAngularApp.financeData
 * @description
 * # financeData
 * Factory in the spendingAngularApp.
 */
angular.module('spendingAngularApp')
  .factory('finances', function () {

    var spendingData;
    var categories = [];
    var searchRecords = {
      category: null,
      description: null,
      priceMin: null,
      priceMax: null
    };

    function Year() {
      return {
        month: {}
      };
    }

    function Month() {
      return {
        total: 0,
        day: {}
      };
    }

    function Day() {
      return {
        total: 0,
        transactions: []
      };
    }

    return {
      setSpending: function (data) {
        spendingData = data;
        return this.getSpending();
      },

      getSpending: function() {
        return spendingData;
      },

      updateFilterAttributes: function(attrs) {
        searchRecords = attrs;
      },

      parseDate: function(transaction) {
        var re = new RegExp(/((^\d{1,2}|\s\d{1,2})\/\d{2}\s)/);
        var newDate = transaction.description.match(re);
        if (newDate) {
          var date  = new Date(transaction.date);
          var year  = date.getYear() - 100;
          return newDate[0] + '/' + year;
        }
        return transaction.date;
      },

      parseDescription: function(transaction) {
        var purchaseRE = new RegExp(/(purchase\s*authorized\s*on\s*)/i);
        var rand16RE = new RegExp(/\S{16} (card) \d{4,}/i);
        
        return transaction.description.replace(purchaseRE, '').replace(rand16RE,'');
      },

      buildSpendingData: function(data) {
        var self = this;
        var spending = {};
        self.resetCategories();

        angular.forEach(data, function(transaction) {
          self.buildCategories(transaction.category);
          transaction.amount      = parseFloat(transaction.amount);
          transaction.date        = self.parseDate(transaction);
          transaction.description = self.parseDescription(transaction);

          var date  = new Date(transaction.date);
          var year  = date.getYear() + 1900;
          var month = date.getMonth() + 1;
          var day   = date.getDate();

          spending[year]                       = spending[year] || new Year();
          spending[year].month[month]          = spending[year].month[month] || new Month();
          spending[year].month[month].day[day] = spending[year].month[month].day[day] || new Day();

          if (self.validateTransaction(transaction)) {
            spending[year].month[month].total += transaction.amount;
            spending[year].month[month].day[day].total += transaction.amount;
            spending[year].month[month].day[day].transactions.push(transaction);
          }
        });

        return spending;
      },

      buildCategories: function(category) {
        if (categories.indexOf(category) === -1) {
          categories.push(category);
        }
      },

      getCategories: function() {
        return categories;
      },

      resetCategories: function() {
        categories = [];
      },

      validatePrice: function(amount) {
        var min = true, max = true;
        if (searchRecords.priceMin) {
          min = amount >= searchRecords.priceMin;
        }
        if (searchRecords.priceMax) {
          max = amount <= searchRecords.priceMax;
        }
        return min && max;
      },

      validateCategory: function(category) {
        if (searchRecords.category) {
          return category === searchRecords.category;
        }
        return true;
      },

      validateDescription: function(description) {
        if (searchRecords.description) {
          return description.toLowerCase().indexOf(searchRecords.description.toLowerCase()) > -1;
        }
        return true;
      },

      validateTransaction: function(transaction) {
        var price       = this.validatePrice(transaction.amount);
        var category    = this.validateCategory(transaction.category);
        var description = this.validateDescription(transaction.description);

        return price && category && description;
      }

    };
  });
