'use strict';

var TodoListApp = angular.module('TodoListApp', [
	'ngRoute',
	'TodoControllers',
	'todoListFilter'
]);


TodoListApp.config(['$routeProvider',
	function($routeProvider){
		$routeProvider
			.when('/todos', { templateUrl: 'partials/main.html', controller: 'MainCtrl'})
			.when('/todos/new', {templateUrl: 'partials/new.html', controller: 'NewTodoCtrl'})
			.when('/todos/:todoId', {templateUrl: 'partials/new.html', controller: 'EditTodoCtrl'})
			.otherwise({
				redirectTo: '/todos'
			});
	}
]);