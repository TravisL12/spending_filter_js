'use strict';

/**
 * @ngdoc service
 * @name spendingAngularApp.financeData
 * @description
 * # financeData
 * Factory in the spendingAngularApp.
 */
angular.module('spendingAngularApp').factory('finances', function () {

    var spendingData,
        categories = {},
        searchRecords = {
          description: null,
          priceMin: null,
          priceMax: null
        };

    function parseDescription (transaction) {
      var purchaseRE = new RegExp(/(purchase\s*authorized\s*on\s*)/i);
      var rand16RE = new RegExp(/\S{16} (card) \d{4,}/i);
      
      return transaction.description.replace(purchaseRE, '').replace(rand16RE,'');
    }

    function parseDate (transaction) {
      var re = new RegExp(/((^\d{1,2}|\s\d{1,2})\/\d{2}\s)/);
      var newDate = transaction.description.match(re);
      if (newDate) {
        var date  = new Date(transaction.date);
        var year  = date.getYear() - 100;
        return newDate[0] + '/' + year;
      }
      return transaction.date;
    }

    function Year() {
      this.total = 0;
      this.month = {};
    }

    function Month() {
      this.total = 0;
      this.day = {};
    }

    function Day() {
      this.total = 0;
      this.transactions = [];
    }

    return {

      clearFilters: function () {
        searchRecords = {
          description: null,
          priceMin: null,
          priceMax: null
        };
        return searchRecords;
      },

      set updateFilterAttributes (attrs) {
        searchRecords = attrs;
      },

      buildSpendingData: function (data) {
        var self = this;
        var spending = {};
        // categories = searchRecords.category;

        angular.forEach(data, function (transaction) {
          self.buildCategories(transaction.category);
          transaction.amount      = parseFloat(transaction.amount);
          transaction.date        = parseDate(transaction);
          transaction.description = parseDescription(transaction);

          var date  = new Date(transaction.date);
          var year  = date.getYear() + 1900;
          var month = date.getMonth() + 1;
          var day   = date.getDate();

          spending[year]                       = spending[year]                       || new Year();
          spending[year].month[month]          = spending[year].month[month]          || new Month();
          spending[year].month[month].day[day] = spending[year].month[month].day[day] || new Day();

          if (self.validateTransaction(transaction)) {
            spending[year].total += transaction.amount;
            spending[year].month[month].total += transaction.amount;
            spending[year].month[month].day[day].total += transaction.amount;
            spending[year].month[month].day[day].transactions.push(transaction);
          }
        });

        return spending;
      },

      buildCategories: function (category) {
        if (categories[category] === undefined) {
          categories[category] = true;
        }
      },

      set spending(data) {
        spendingData = data;
      },

      get spending() {
        return spendingData;
      },

      set categories(data) {
        categories = data;
      },

      get categories() {
        return categories;
      },


      validatePrice: function (amount) {
        var min = true, max = true;
        if (searchRecords.priceMin) {
          min = amount >= searchRecords.priceMin;
        }
        if (searchRecords.priceMax) {
          max = amount <= searchRecords.priceMax;
        }
        return min && max;
      },

      validateCategory: function (category) {
        return categories[category];
      },

      validateDescription: function (description) {
        if (searchRecords.description) {
          return description.toLowerCase().indexOf(searchRecords.description.toLowerCase()) > -1;
        }
        return true;
      },

      validateTransaction: function (transaction) {
        var price       = this.validatePrice(transaction.amount);
        var category    = this.validateCategory(transaction.category);
        var description = this.validateDescription(transaction.description);

        return price && category && description;
      }

    };
  });
