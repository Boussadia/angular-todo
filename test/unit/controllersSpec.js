'use strict';

describe('UNIT: Testing controllers module', function(){

	beforeEach(module('TodoControllers'));

	it('should have a module', function() {
		expect(module).not.toBe(null);
	});

	describe('CONTROLLER : MainCtrl', function(){
		var scope, ctrl;

		beforeEach(
			inject(function($rootScope, $controller, storage){
				scope = $rootScope.$new();
				ctrl = $controller("MainCtrl", {$scope: scope, storage:storage });
					
			})
		)

		it('todos initialization should be an empty array',function(){
			expect(scope.todos.length).toBe(0);
		})
		
	})
})