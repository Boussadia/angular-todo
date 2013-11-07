'use strict';

angular.module('todoListFilter', []).filter('checked', function() {
	return function(input) {
		return input ? 'done' : '';
	};
});