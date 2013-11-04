'use strict';

/* jasmine specs for controllers go here */
describe('Controller Tests', function () {

  beforeEach(module('hamsterApp'));
  //beforeEach(module('hamsterServices'));

  describe('MainCtrl', function () {
      var scope, ctrl, service;

      beforeEach(inject(function ($rootScope, $controller, $injector) {
        scope = $rootScope.$new();
        service = $injector.get('socket');
        ctrl = $controller('MainCtrl', {$scope: scope});
      }));

      it('should instantiate an empty array', function () {
        expect(scope.hamsters).toEqual([]);
      });
    }
  )
});