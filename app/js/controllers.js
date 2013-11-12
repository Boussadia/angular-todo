'use strict';


// Instanciation de notre module qui contient tous les controllers
var TodoControllers = angular.module('TodoControllers', []);


// Variable globale qui contient nos taches
var todos = [];

function __init__(localStorageService){
	var nb_tasks = localStorageService.get('nb_tasks') || "0";
	nb_tasks = parseInt(nb_tasks);
	if(nb_tasks !== todos.length){

		for(var i = 0; i < nb_tasks; i++){
			var task = JSON.parse(localStorageService.get('task_'+i));
			todos.push(task);
		}
	}
	
	localStorageService.add('nb_tasks', nb_tasks);

}


// Premier controller qui s'occupe de gérer la page principale
TodoControllers.controller('MainCtrl', ['$scope', 'localStorageService',
	function MainCtrl($scope,localStorageService){
		$scope.todos = todos;
		__init__(localStorageService);


		$scope.setDone = function(index){
			var todo = todos[index];
			todo = {
				'title': todo.title,
				'description': todo.description,
				'done': !todo.done
			};
			localStorageService.add('task_'+index, JSON.stringify(todo));
		}


		$scope.clear = function(index){
			if(index === 0 || index ){
				// supprimer uniquement l'élémént d'indice index
				var todo = todos.splice(index, 1);
				var nb_tasks = parseInt(localStorageService.get('nb_tasks'));
				for(var i = index + 1; i<nb_tasks; i++){
					var t_i = localStorageService.get('task_'+i);
					localStorageService.add('task_'+(i-1), t_i);
				}
				localStorageService.remove('task_'+(nb_tasks-1));
				localStorageService.add('nb_tasks', nb_tasks-1);

			}else{
				// Tout effacer
				localStorageService.clearAll();
				localStorageService.add('nb_tasks', 0);
				todos.length = 0;
			}
		}
	}
]);


function validate(event, keyEvent){
	if(keyEvent.keyCode === 13){
		event.targetScope.$broadcast('todo:validate')
	}
}


// Controller qui permet de gérer l'édition d'une tache
TodoControllers.controller('EditTodoCtrl', ['$scope', '$routeParams', '$location', 'localStorageService',
	function EditTodoCtrl($scope, $routeParams, $location,localStorageService){
		var todoId = $routeParams.todoId;
		$scope.state = "edit";
		__init__(localStorageService);

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

		$scope.$on('todo:keyup', validate);
		$scope.$on('todo:validate', function(event){
			$scope.editTodo($scope.title, $scope.description);
		})

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

		$scope.$on('todo:keyup', validate);
		$scope.$on('todo:validate', function(event){
			$scope.addNewTodo($scope.title, $scope.description);
		})
		
	}
]);