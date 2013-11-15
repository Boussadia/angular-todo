'use strict';


// Instanciation de notre module qui contient tous les controllers
var TodoControllers = angular.module('TodoControllers', [
	'ui.bootstrap',
	'TodoServices',
	'todoListFilter'
]);

// Premier controller qui s'occupe de gérer la page principale
TodoControllers.controller('MainCtrl', ['$scope', 'storage',
	function MainCtrl($scope, storage){
		storage.init();
		$scope.todos = storage.todos;

		$scope.setDone = function(index){
			var todo = storage.get_task(index);
			todo.done = !todo.done;
			storage.add(todo,index);
		}

		$scope.clear = function(index){
			storage.remove(index);
		}
	}
]);


function validate(event, keyEvent){
	if(keyEvent.keyCode === 13){
		event.targetScope.$broadcast('todo:validate')
	}
}


// Controller qui permet de gérer l'édition d'une tache
TodoControllers.controller('EditTodoCtrl', ['$scope', '$routeParams', '$location', 'storage',
	function EditTodoCtrl($scope, $routeParams, $location,storage){
		var todoId = $routeParams.todoId;
		$scope.state = "edit";

		var task = storage.get_task(todoId);

		if(!task){
			alert("La todo n'existe pas !");
			$location.path('/');
		}

		$scope.title = task.title;
		$scope.description = task.description;


		$scope.editTodo = function(title, description){
			if(title){
				storage.add({
					'description': description,
					'title': title,
					'done': storage.todos[todoId].done
				},todoId);

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
TodoControllers.controller('NewTodoCtrl', ['$scope', '$location', 'storage',
	function NewTodoCtrl($scope, $location, storage){
		$scope.title = "";
		$scope.description = "";
		$scope.state = "new";

		$scope.addNewTodo = function(title, description){
			if(title){
				storage.add({'title': title, "description": (description || ""), done: false});
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

TodoControllers.controller('NavCtrl', ['$scope', '$route',
	function($scope, $route){
		$scope.route={name:''};
		
		$scope.$on('$routeChangeSuccess', function(event, current, previous){
			if($route.current.event){
				$scope.route.name = $route.current.event.route;
			}else{
				$scope.route.name = "";
			}
			
		})
	}
])