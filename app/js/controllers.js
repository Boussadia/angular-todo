'use strict';

var TodoControllers = angular.module('TodoControllers', []);

var todos = [];

TodoControllers.controller('MainCtrl', ['$scope',
	function MainCtrl($scope){
		$scope.todos = todos;

	}
]);

TodoControllers.controller('EditTodoCtrl', ['$scope', '$routeParams', '$location',
	function EditTodoCtrl($scope, $routeParams, $location){
		var todoId = $routeParams.todoId;
		$scope.state = "edit";

		if(todoId<todos.length){
			$scope.title = todos[todoId].title;
			$scope.description = todos[todoId].description;

		}else{
			alert("La todo n'existe pas !");
			$location.path('/');
		}


		$scope.editTodo = function(title, description){
			if(title){
				todos[todoId] = {
					'description': description,
					'title': title
				}
				$location.path('/');
			}else{
				alert("Le titre ne doit pas être vide !");
			}
		}


	}
]);

TodoControllers.controller('NewTodoCtrl', ['$scope', '$location', 
	function NewTodoCtrl($scope, $location){
		$scope.title = "";
		$scope.description = "";
		$scope.state = "new";

		$scope.addNewTodo = function(title, description){
			if(title){
				todos.push({'title': title, "description": (description || "")})
				$location.path('/');
			}else{
				alert("Le titre ne doit pas être vide !");
			}
		}
		
	}
]);