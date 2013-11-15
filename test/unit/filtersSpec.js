'use strict';

describe('UNIT: Testing filters', function() {

	beforeEach(angular.mock.module('todoListFilter'));

	it('should have a checked filter', inject(function($filter) {
		expect($filter('checked')).not.toBe(null);
	}));

	beforeEach(angular.mock.module('todoListFilter'));

	it('should return \'done\' if true, empty string otherwise',
		inject(function($filter) {
			var checked = $filter('checked');
			expect(checked(true)).toBe('done');
			expect(checked(false)).toBe('');
		})
	);

});