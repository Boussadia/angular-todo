'use strict';

angular.module('TodosAnimations', ['ngAnimate']);
'use strict';

// Initialisation d'une application Angular avec les dépendances dont nous avons besoin
var TodoListApp = angular.module('TodoListApp', [
	'ngRoute',
	'TodosAnimations',
	'todoListFilter',
	'TodoControllers'
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

'use strict';

angular.module('todoListFilter', []).filter('checked', function() {
	return function(input) {
		return input ? 'done' : '';
	};
});
'use strict';

angular.module('TodoServices', ['LocalStorageModule'], ['$provide', function($provide){
	var todos = [];
	$provide.factory('storage', ['localStorageService', function(localStorageService){
		return {
			todos: [],
			add: function(todo, index){
				this.init();
				if(index === 0 || index ){
					this.todos[index] = todo;
				}else{
					var nb_tasks = this.todos.push(todo);
					localStorageService.add('nb_tasks', nb_tasks);
					index = nb_tasks - 1;
				}
				localStorageService.add('task_'+index, JSON.stringify(todo));
			},
			remove: function(index){
				this.init();
				if(index === 0 || index ){
					// supprimer uniquement l'élémént d'indice index
					var todo = this.todos.splice(index, 1);
					var nb_tasks = this.get_nb_tasks();
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
					this.todos.length = 0;
				}
			},
			init: function(){
				var nb_tasks = this.get_nb_tasks();
				if(nb_tasks !== this.todos.length){
					for(var i = 0; i < nb_tasks; i++){
						var task = JSON.parse(localStorageService.get('task_'+i));
						this.todos.push(task);
					}
				}
				localStorageService.add('nb_tasks', nb_tasks);
			},
			get_nb_tasks: function(){
				return parseInt(localStorageService.get('nb_tasks') || "0")
			},
			get_task: function(todoId){
				this.init();
				if(todoId<this.todos.length){
					return this.todos[todoId];
				}else{
					return undefined;
				}

				
			}
		}
	}]);
}])