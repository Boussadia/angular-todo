'use strict';

var TodoListApp = angular.module('TodoListApp', [
	'ngRoute',
	'TodoControllers'
]);


TodoListApp.config(['$routeProvider',
	function($routeProvider){
		$routeProvider
			.when('/todos', { templateUrl: 'partials/main.html', controller: 'MainCtrl'})
			.when('/todos/:todoId', {templateUrl: 'partials/todo.html', controller: 'EditTodoCtrl'})
			.when('/todos/new', {templateUrl: 'partials/new.html', controller: 'NewTodoCtrl'})
			.otherwise({
				redirectTo: '/todos'
			});
	}
]);