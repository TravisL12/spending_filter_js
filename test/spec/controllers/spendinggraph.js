'use strict';

describe('Controller: SpendinggraphCtrl', function () {

  // load the controller's module
  beforeEach(module('spendingAngularApp'));

  var SpendinggraphCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SpendinggraphCtrl = $controller('SpendinggraphCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SpendinggraphCtrl.awesomeThings.length).toBe(3);
  });
});
