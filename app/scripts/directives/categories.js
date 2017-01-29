'use strict';

angular.module('spendingAngularApp').directive('categories', function () {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/categories_table.html',
    scope: {
      spendingType: '@',
      categories: '=',
      filterPrice: '&',
    },
    link: function (scope) {
      scope.minCategoryTotal = 500;
      scope.isAllCategoriesSelected = true;

      function maxCategoryTotal() {
        var categories = this.categories;
        var totals = Object.keys(categories).map(function(name) {
          return categories[name].value ? categories[name].total : 0;
        });
        return Math.max.apply(null, totals);
      }

      scope.setCategoryStyling = function() {
        var category = this.category;
        if (category.total === 0) { return; }
        var formatSteps = 10; // Arbitrary number of color gradients, also referenced in CSS
        var maxCategory = maxCategoryTotal.call(this);
        var ratio = category.total < maxCategory ? Math.ceil(category.total / maxCategory * formatSteps) : formatSteps;
        return 'day-conditional-' + ratio;
      };

      scope.toggleAllCategories = function () {
        angular.forEach(scope.categories, function (category) {
          category.value = scope.isAllCategoriesSelected;
        });

        scope.filterPrice();
      };

      scope.singleCategoryChoice = function () {
        var activeCategories = scope.categories.filter(function(category) {
          return category.value;
        });

        if (activeCategories.length === 1 && activeCategories[0].name === this.category.name) {
          scope.isAllCategoriesSelected = true;
        } else {
          scope.isAllCategoriesSelected = false;
        }

        scope.toggleAllCategories();
        this.category.value = !scope.isAllCategoriesSelected;
        scope.filterPrice();
      };

    }
  };

});
