'use strict';

// Initialisation d'une application Angular avec les dépendances dont nous avons besoin
var TodoListApp = angular.module('TodoListApp', [
	'ngRoute',
	'TodosAnimations'
]);


// Le routeur qui va nous permettre d'éxécuter des controller en fonction de l'url du hash
TodoListApp.config(['$routeProvider',
	function($routeProvider){
		$routeProvider
			.when('/todos', { templateUrl: 'partials/main.html', controller: 'MainCtrl', event:{route:"main"}})
			.when('/todos/new', {templateUrl: 'partials/todo.html', controller: 'NewTodoCtrl', event:{route:"new"}})
			.when('/todos/:todoId', {templateUrl: 'partials/todo.html', controller: 'EditTodoCtrl', event:{route:"edit"}})
			.otherwise({
				redirectTo: '/todos'
			});
	}
]);