'use strict';


// Instanciation de notre module qui contient tous les controllers
var TodoControllers = angular.module('TodoControllers', []);


// Variable globale qui contient nos taches
var todos = [];


// Premier controller qui s'occupe de gérer la page principale
TodoControllers.controller('MainCtrl', ['$scope', 'localStorageService',
	function MainCtrl($scope,localStorageService){
		$scope.todos = todos;
		var nb_tasks = localStorageService.get('nb_tasks') || "0";
		nb_tasks = parseInt(nb_tasks);
		
		if(nb_tasks !== todos.length){

			for(var i = 0; i < nb_tasks; i++){
				var task = JSON.parse(localStorageService.get('task_'+i));
				todos.push(task);
			}
		}
		
		localStorageService.add('nb_tasks', nb_tasks);


		$scope.setDone = function(index){
			var todo = todos[index];
			todo = {
				'title': todo.title,
				'description': todo.description,
				'done': !todo.done
			};
			localStorageService.add('task_'+index, JSON.stringify(todo));
		}
	}
]);


// Controller qui permet de gérer l'édition d'une tache
TodoControllers.controller('EditTodoCtrl', ['$scope', '$routeParams', '$location', 'localStorageService',
	function EditTodoCtrl($scope, $routeParams, $location,localStorageService){
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
					'title': title,
					'done': todos[todoId].done
				}
				localStorageService.add('task_'+todoId, JSON.stringify(todos[todoId]));
				$location.path('/');
			}else{
				alert("Le titre ne doit pas être vide !");
			}
		}

	}
]);


// Controller qui permet de créer une nouvelle tache
TodoControllers.controller('NewTodoCtrl', ['$scope', '$location',  'localStorageService',
	function NewTodoCtrl($scope, $location,localStorageService){
		$scope.title = "";
		$scope.description = "";
		$scope.state = "new";

		$scope.addNewTodo = function(title, description){
			if(title){
				todos.push({'title': title, "description": (description || ""), done: false});
				var l = todos.length;
				localStorageService.add('task_'+(l-1), JSON.stringify(todos[l-1]));
				localStorageService.add('nb_tasks', l);
				$location.path('/');
			}else{
				alert("Le titre ne doit pas être vide !");
			}
		}
		
	}
]);