'use strict';

describe('Controller: BalancesCtrl', function () {

  // load the controller's module
  beforeEach(module('spendingAngularApp'));

  var BalancesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BalancesCtrl = $controller('BalancesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BalancesCtrl.awesomeThings.length).toBe(3);
  });
});
