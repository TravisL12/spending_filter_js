"use strict";angular.module("spendingAngularApp",["ngCookies","ngRoute","ngSanitize","ngCsvImport"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main",resolve:{allRecords:["$http",function(a){return a({method:"GET",url:"total_spending.json"}).success(function(a){return a})}]}}).otherwise({redirectTo:"/"})}]),angular.module("spendingAngularApp").controller("MainCtrl",["$scope","allRecords",function(a,b){function c(){return{month:{}}}function d(){return{maxDayTotal:0,total:0,day:{}}}function e(){return{total:0,transactions:[]}}function f(b){-1===a.categories.indexOf(b)&&a.categories.push(b)}function g(){a.categories=[],angular.forEach(a.csv.result,function(a){f(a.category),a.amount=Number(a.amount.replace(/[^0-9\.-]+/g,""))}),a.rawSpendingData=a.csv.result,n(a.csv.result)}function h(a,b){a.day[b].total>a.maxDayTotal&&(a.maxDayTotal=a.day[b].total)}function i(b){var c=!0,d=!0;return a.searchRecords.priceMin&&(c=b>=a.searchRecords.priceMin),a.searchRecords.priceMax&&(d=b<=a.searchRecords.priceMax),c&&d}function j(b){return a.searchRecords.category?b===a.searchRecords.category:!0}function k(b){return a.searchRecords.description?b.toLowerCase().indexOf(a.searchRecords.description.toLowerCase())>-1:!0}function l(a){var b=i(a.amount),c=j(a.category),d=k(a.description);return b&&c&&d}function m(b){a.categories=[];var g={};return angular.forEach(b,function(a){f(a.category);var b=new Date(a.date),i=b.getYear()+1900,j=b.getMonth()+1,k=b.getDate();g[i]=g[i]||new c,g[i].month[j]=g[i].month[j]||new d,g[i].month[j].day[k]=g[i].month[j].day[k]||new e,l(a)&&(g[i].month[j].total+=a.amount,g[i].month[j].day[k].total+=a.amount,g[i].month[j].day[k].transactions.push(a),h(g[i].month[j],k))}),g}function n(b){a.allRecords=m(b),a.yearRange=Object.keys(a.allRecords),a.selectedYear=a.selectedYear||a.yearRange[a.yearRange.length-1],a.showTransactions(1,2)}a.getNumber=function(a){return new Array(a)},a.selectYear=function(){a.selectedYear=this.year},a.highlightActiveDay=function(){return a.transactionDate===this.$index+1+"/"+(this.$parent.$index+1)},a.filterPrice=function(){n(a.rawSpendingData)},a.$watch("csv.result",function(a,b){a!==b&&g()}),a.searchRecords={options:{debounce:1e3}},a.csv={content:null,header:!0,separator:",",result:null},a.getDate=function(b,c){var d=a.allRecords[a.selectedYear].month[b];return d?c?a.allRecords[a.selectedYear].month[b].day[c]:d:void 0},a.setConditionalFormatting=function(){var b=a.getDate(this.$index+1);if(b){var c=a.getDate(this.$index+1,this.$parent.$index+1);if(c){var d=15,e=Math.ceil(parseFloat(c.total/b.maxDayTotal)*d);return"conditional-"+e}}return"empty"},a.showTransactions=function(b,c){b=b||this.$index+1,c=c||this.$parent.$index+1,a.transactionDate=b+"/"+c,a.selectedDate=a.getDate(b,c)},b.error||(a.rawSpendingData=b.data,n(b.data))}]),angular.module("spendingAngularApp").run(["$templateCache",function(a){a.put("views/main.html",'<div class="date-grid col-md-7"> <table class="table table-bordered table-condensed"> <thead> <th></th> <th class="months" ng-repeat="i in getNumber(12) track by $index">{{$index+1}}</th> </thead> <tbody> <tr ng-repeat="i in getNumber(31) track by $index"> <td class="days-of-month">{{$index+1}}</td> <td class="day" ng-class="[{&quot;active&quot;: highlightActiveDay()}, setConditionalFormatting()]" ng-click="showTransactions()" ng-repeat="i in getNumber(12) track by $index">{{getDate($index+1, $parent.$index+1).total | currency:\'$\':0 }}</td> </tr> <tr> <td class="days-of-month">Total:</td> <td class="day" ng-repeat="i in getNumber(12) track by $index">{{getDate($index+1).total | currency:\'$\':0}}</td> </tr> </tbody> </table> </div> <div class="col-md-5"> <div class="row input-fields"> <div class="form-group"> <ng-csv-import class="csv-input" content="csv.content" header="csv.header" separator="csv.separator" result="csv.result"></ng-csv-import> </div> <div class="year-pagination"> <label>Years:</label> <ul><li ng-repeat="year in yearRange" ng-class="{&quot;active&quot;: selectedYear == year }" ng-click="selectYear()">{{year}}</li></ul> </div> <div class="form-group"> <label>Category:</label> <select class="form-control" ng-change="filterPrice()" ng-model="searchRecords.category" ng-options="category for category in categories"></select> </div> <div class="form-group"> <label>Description:</label> <input class="form-control" ng-change="filterPrice()" ng-model-options="searchRecords.options" type="text" ng-model="searchRecords.description"> </div> <div class="row form-group"> <div class="col-md-6"> <label>Min Price:</label> <input class="form-control" ng-change="filterPrice()" type="number" step="5" min="0" ng-model-options="searchRecords.options" ng-model="searchRecords.priceMin"> </div> <div class="col-md-6"> <label>High Price:</label> <input class="form-control" ng-change="filterPrice()" type="number" step="5" min="0" ng-model-options="searchRecords.options" ng-model="searchRecords.priceMax"> </div> </div> </div> <div class="row transaction-table"> <h4>Date: {{transactionDate}}/{{selectedYear}}</h4> <table class="table table-hover table-striped table-condensed"> <thead> <th>Amount</th> <th>Category</th> <th>Description</th> </thead> <tbody> <tr ng-repeat="transaction in selectedDate.transactions"> <td class="col-md-2">{{transaction.amount | currency}}</td> <td class="col-md-3">{{transaction.category}}</td> <td class="col-md-7">{{transaction.description}}</td> </tr> </tbody> </table> </div> </div>')}]);