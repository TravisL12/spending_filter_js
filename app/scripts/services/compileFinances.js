'use strict';

/**
 * @ngdoc service
 * @name spendingAngularApp.financeData
 * @description
 * # financeData
 * Factory in the spendingAngularApp.
 */
angular.module('spendingAngularApp').factory('compileFinances', function () {

    // TODO build in checks to not calculate past the current day
    var today = new Date();

    var spending = {},
        balances = {},
        categories = {},
        searchRecords = {
          description: [],
          priceMin: null,
          priceMax: null
        };

    function isGreaterThanToday(date) {
      return today > date;
    }

    function parseDescription (transaction) {
      var purchaseRE  = new RegExp(/(purchase\s*authorized\s*on\s*)/i);
      var rand16RE    = new RegExp(/\S{16} (card) \d{4,}/i);
      var leadDatesRE = new RegExp(/\d{2}\/\d{2}\s*/i);
      var randomNumRE = new RegExp(/[\S]*\d{3,}/gi);
      
      return transaction.description.replace(purchaseRE, '').replace(rand16RE,'').replace(leadDatesRE,'').replace(randomNumRE,'');
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

    function resetCategoryTotals () {
      for (var i in categories) {
        categories[i].total = 0;
      }
    }

    function Year() {
      this.total  = 0;
      this.month  = {};
      this.maxDay = 0;
      this.maxMonth = 0;
      this.buildMonths();
    }

    Year.prototype.buildMonths = function () {
      for (var i = 1; i <= 12; i++) {
        this.month[i] = new Month();
        for (var k = 1; k <= 31; k++) {
          this.month[i].day[k] = new Day();
        }
      }
    };

    function Month() {
      this.total = 0;
      this.day = {};
    }

    function Day() {
      this.total = 0;
      this.transactions = [];
    }

    return {

      get searchRecords () {
        return {
          description: [],
          priceMin: null,
          priceMax: null
        };
      },

      set searchRecords (search) {
        searchRecords = search;
      },

      get categories() {
        return categories;
      },

      set categories(data) {
        categories = data;
      },

      get spending() {
        return spending;
      },

      set spending(data) {
        for (var i in data) {
          var transaction = data[i];
          transaction.amount      = parseFloat(transaction.amount);
          transaction.date        = parseDate(transaction);
          transaction.description = parseDescription(transaction);

          if (categories[transaction.category] === undefined) {
            categories[transaction.category] = {
              name: transaction.category,
              value: true,
              total: 0
            };
          }

          var date  = new Date(transaction.date),
              year  = date.getYear() + 1900,
              month = date.getMonth() + 1,
              day   = date.getDate();

          spending[year] = spending[year] || new Year();
          spending[year].month[month].day[day].transactions.push(transaction);
        }
      },

      yearSpending: function (year) {
        var yearData = spending[year];
        var yearSpending = new Year();
        yearSpending.total = yearData.total;
        resetCategoryTotals();

        for (var month in yearData.month) {
          for (var day in yearData.month[month].day) {
            for (var transIdx in yearData.month[month].day[day].transactions) {
              var transaction = yearData.month[month].day[day].transactions[transIdx];
              categories[transaction.category].total += transaction.amount;
              if (this.validateTransaction(transaction)) {
                yearSpending.total += transaction.amount;
                yearSpending.month[month].total += transaction.amount;
                yearSpending.month[month].day[day].total += transaction.amount;

                if (yearSpending.month[month].day[day].total > yearSpending.maxDay) {
                  yearSpending.maxDay = yearSpending.month[month].day[day].total;
                }

                if (yearSpending.month[month].total > yearSpending.maxMonth) {
                  yearSpending.maxMonth = yearSpending.month[month].total;
                }

                yearSpending.month[month].day[day].transactions.push(transaction);
              }
            }
          }
        }

        return yearSpending;
      },

      get balances () {
        return balances;
      },

      set balances (data) {
        var lastBalance = {
          oldchecking: 0,
          checking:    0,
          nanny:       0,
          savings:     0
        };

        var startYear = 2004,
            endYear   = today.getFullYear();

        for (var k = startYear; k <= endYear; k++) {
          balances[k] = new Year();          
        }

        for (var yearBal in balances) {
          for (var monthBal in balances[yearBal].month) {
            for (var dayBal in balances[yearBal].month[monthBal].day) {
              
              if (!isGreaterThanToday(new Date(yearBal, monthBal-1, dayBal))) {
                break;
              }

              var balanceData = data[monthBal + '/' + dayBal + '/' + yearBal.slice(2,4)];
              if (!balanceData) {
                balances[yearBal].month[monthBal].day[dayBal].total = lastBalance.oldchecking + lastBalance.checking + lastBalance.nanny + lastBalance.savings;
                balances[yearBal].month[monthBal].day[dayBal].transactions = [
                  {description:'Old Checking', amount: lastBalance.oldchecking},
                  {description:'Checking',     amount: lastBalance.checking   },
                  {description:'Nanny',        amount: lastBalance.nanny      },
                  {description:'Savings',      amount: lastBalance.savings    }
                ];
              } else {
                var oldchecking = (balanceData.oldchecking || lastBalance.oldchecking),
                    checking    = (balanceData.checking    || lastBalance.checking),
                    nanny       = (balanceData.nanny       || lastBalance.nanny),
                    savings     = (balanceData.savings     || lastBalance.savings);

                balances[yearBal].month[monthBal].day[dayBal].total = oldchecking + checking + nanny + savings;
                balances[yearBal].month[monthBal].day[dayBal].transactions = [
                  {description: 'Old Checking', amount: oldchecking},
                  {description: 'Checking',     amount: checking},
                  {description: 'Nanny',        amount: nanny},
                  {description: 'Savings',      amount: savings}
                ];

                lastBalance = {
                  oldchecking: oldchecking,
                  checking:    checking,
                  nanny:       nanny,
                  savings:     savings
                };
              }

              if (balances[yearBal].month[monthBal].day[dayBal].total > balances[yearBal].maxDay) {
                balances[yearBal].maxDay = balances[yearBal].month[monthBal].day[dayBal].total;
              }

              balances[yearBal].month[monthBal].total = balances[yearBal].month[monthBal].day[dayBal].total - balances[yearBal].month[monthBal].day[1].total;
            }
            balances[yearBal].total += balances[yearBal].month[monthBal].total;
          }
        }
      },

      validatePrice: function () {
        var amount = this.amount;
        var min = true, max = true;
        if (searchRecords.priceMin) {
          min = amount >= searchRecords.priceMin;
        }
        if (searchRecords.priceMax) {
          max = amount <= searchRecords.priceMax;
        }
        return min && max;
      },

      validateDescription: function () {
        var description = this.description;
        var result = !searchRecords.description.length; // set result to false if search terms exist
        for (var i in searchRecords.description) {
          var desc = searchRecords.description[i];
          result = description.toLowerCase().indexOf(desc.toLowerCase()) > -1;
          if (result) {
            break;
          }
        }
        return result;
      },

      validateTransaction: function (transaction) {
        var category    = categories[transaction.category].value,
            price       = this.validatePrice.call(transaction),
            description = this.validateDescription.call(transaction);

        return category && price && description;
      }

    };
  });
