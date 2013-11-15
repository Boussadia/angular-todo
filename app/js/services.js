'use strict';

angular.module('TodoServices', ['LocalStorageModule'], function($provide){
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
})