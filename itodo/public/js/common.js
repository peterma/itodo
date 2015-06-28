var todos = [], id = 1;

var iToDo = angular.module("iToDo", ['itodo.datetime', 'itodo.countdown', 'itodo.heart', 'itodo.star', 'itodo.service.date']);

iToDo.constant("priorities", [
	{name : "Urgent", value : "1"},
	{name : "Normal", value : "2"},
	{name : "Low", value : "3"}
]);

// TODO Search -- use "filter"
iToDo.controller("listTodoController", function($scope) {
	$scope.todos = todos;
	$scope.dlAsc = true;
	
	$scope.completeToDo = function(current) {
		var target = _.find(todos, function(todo) {
			return current.id === todo.id;
		});
		
		target.finished = true;
	};
	
	$scope.deleteTodo = function(current) {
		var where = _.findWhere(todos, function(todo) {
			return current.id === todo.id;
		});
		
		todos.splice(where, 1);
	};
	
	$scope.isFinished = function(todo) {
		return todo.finished ? "finished" : "";
	};
	
	$scope.sortByPriority = function() {
		$scope.pAsc = !$scope.pAsc;
		
		_.sortBy($scope.todos, $scope.sortPriorities);
	};
	
	$scope.sortPriorities = function(item) {
		return $scope.pAsc ? item.priority : -item.priority;
	};
	
	$scope.showEditDialog = function(todo) {
		$scope.currentTodo = todo;
		$scope.$broadcast('itodo.editTodo', todo);
	};
	
	$scope.closeModal = function() {
		$scope.currentTodo = null;
	};
	
	$scope.hasCurrentTodo = function() {
		return $scope.currentTodo != null ? "show" : "";
	};
	
	$scope.$on('itodo.endEdit', function(event, editedTodo) {
		if(editedTodo) {
			// Save to the list
			var where = _.findWhere(todos, function(todo) {
				return current.id === todo.id;
			});
			
			_.exend(todos[where], editedTodo);
		}
		
		$scope.closeModal();
	});
	
});

iToDo.controller("editTodoController", ['$scope', 'priorities', '$interval', 'dateService', function($scope, priorities, $interval, dateService) {
	
	$scope.$on('itodo.editTodo', function(event, currentTodo) {
		$scope.todo = currentTodo;
		$scope.todo.countdown = {Y : null, M : null, D : null, h : null, m : null, s : null};
	});
	
	$scope.closeModal = function() {
		$scope.$emit('itodo-endEdit');
	};
	
	$scope.editSubmit= function() {
		$scope.todo.needHelp && (/* 'newTodo' From ?*/newTodo.needHelp = true, newTodo.msg2GetHelp = $scope.todo.msg2GetHelp);
		$scope.$emit('itodo.endEdit', $scope.todo);
	};
	
	$scope.priorities = priorities;
	
	// FIXME To be called where?
	$scope.getDayClass = function(date, mode) {
		if(mode === 'day') {
			var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
			
			for(var i = 0; i < $scope.events.length; i++) {
				var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);
				
				if(dayToCheck === currentDay) {
					return $scope.events[i].status;
				}
			}
		}
		
		return '';
	};
	
	$scope.durationError = function() {
		if($scope.todo) {
			
			var duration = moment.duration({from : $scope.todo.startDate, to : $scope.todo.deadline});
			if(duration.asMilliseconds() < 0) {
				return "text-warning label-warning";
			}
		}
	};
	
	function computeDuration() {
		if($scope.todo) {
			
			$scope.todo.countdown = dateService.computeDuration($scope.todo.startDate, $scope.todo.deadline);
			$scope.todo.duration = dateService.getDurationDesc($scope.todo.startDate, $scope.todo.deadline);
			
			if($scope.todo.countdown) {
				$scope.$broadcast('itodo.countdown', $scope.todo.countdown);
			}
		}
	}
	
	(function() {
		var watches = [
			'todo.startDate.year',
			'todo.startDate.month',
			'todo.startDate.day',
			'todo.startDate.hour',
			'todo.startDate.minute',
			'todo.startDate.second',
			'todo.deadline.year',
			'todo.deadline.month',
			'todo.deadline.day',
			'todo.deadline.hour',
			'todo.deadline.minute',
			'todo.deadline.second'
		];
		
		for(var i = 0; i < watches.length; i++) {
			$scope.$watch(watches[i], function() {
				computeDuration();
			});
		}
	})();
	
	$scope.addRequiredAttr = function() {
		$scope.needHelpRequired = !$scope.needHelpRequired;
		
		// FIXME NOT an angular way!
		var input = $("[ng-model='todo.msg2GetHelp']");
		input.attr("required") ? input.removeAttr("required") : input.attr("required", 'true');
	};
	
}]);

// To use constant 'priorities', it should be imported and injected.
iToDo.controller('addTodoController', ['$scope', 'priorities', '$interval', 'dateService', function($scope, priorities, $interval, dateService) {
	
	function resetModel() {
		$scope.todo = {};
		$scope.todo.priority = "2";
		$scope.todo.startDate = {};
		$scope.todo.deadline = {};
		$scope.todo.confidence = [{value : false}, {value : false}, {value : false}, {value : false}, {value : false}];
		$scope.todo.mood = [{value : false}, {value : false}, {value : false}, {value : false}, {value : false}];
		$scope.todo.countdown = {Y : null, M : null, D : null, h : null, m : null, s : null};
		
		$scope.$broadcast('itodo.heart.clear');
		
		$scope.$broadcast('itodo.star.clear');
		
		$scope.$broadcast('itodo.countdown.clear');
		
		$scope.needHelpRequired = false;
		
		var input = $('[ng-model="todo.msg2GetHelp"]');
		input.attr("required") && input.removeAttr("required");
	}
	
	resetModel();
	
	$scope.priorities = priorities;
	
	$scope.todo.startDate = dateService.getDefaultDate();
	
	$scope.getDayClass = function(date, mode) {
		if(mode === 'day') {
			var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
			
			for(var i = 0; i < $scope.events.length; i++) {
				var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);
				
				if(dayToCheck === currentDay) {
					return $scope.events[i].status;
				}
			}
		}
		
		return '';
	};
	
	$scope.add = function() {
		// TODO Validation : property "deadline" should be set to a future date.
		
		var startDate = $scope.todo.startDate
			, deadline = $scope.todo.deadline;
			
		var newTodo = {
			id : /* TODO uuid */ id++,
			task : $scope.todo.task,
			startDate : startDate, // startDate.year + '-' +startDate.month + '-' + startDate.day + '-' + startDate.hour + '-' + startDate.minute + '-' + startDate.second  
			priority : $scope.todo.priority,
			mood : $scope.todo.mood,
			confidence : $scope.todo.confidence,
			createDate : new Date()
		};
		
		if(deadline.year && deadline.month && deadline.day) {
			newTodo.deadline = deadline.year + '-' +deadline.month + '-' + deadline.day + '-' + deadline.hour + '-' + deadline.minute + '-' + deadline.second;
		}
		
		$scope.todo.needHelp && (newTodo.needHelp = true, newTodo.msg2GetHelp = $scope.todo.msg2GetHelp);
		todos.push(newTodo);
		
		resetModel();
		
		// FIXME NOT an angular way!
		$("#sendDialog").toggle();
		
		// TODO Show msg to user and auto hiding the popup window
		$scope.todo.startDate = dateService.getDefaultDate();
	};
	
	$scope.closeModal = function() {
		// FIXME NOT an angular way!
		$("#sendDialog").toggle();
	};
	
	$scope.durationError = function() {
		var duration = moment.duration({from : $scope.todo.startDate, to : $scope.todo.deadline});
		if(duration.asMilliseconds() < 0) {
			return "text-warning label-warning";
		}
	};
	
	function computeDuration() {
		if($scope.todo) {
			
			$scope.todo.countdown = dateService.computeDuration($scope.todo.startDate, $scope.todo.deadline);
			$scope.todo.duration = dateService.getDurationDesc($scope.todo.startDate, $scope.todo.deadline);
			
			if($scope.todo.countdown) {
				$scope.$broadcast('itodo.countdown', $scope.todo.countdown);
			}
		}
	}
	
	(function() {
		var watches = [
			'todo.startDate.year',
			'todo.startDate.month',
			'todo.startDate.day',
			'todo.startDate.hour',
			'todo.startDate.minute',
			'todo.startDate.second',
			'todo.deadline.year',
			'todo.deadline.month',
			'todo.deadline.day',
			'todo.deadline.hour',
			'todo.deadline.minute',
			'todo.deadline.second'
		];
		
		for(var i = 0; i < watches.length; i++) {
			$scope.$watch(watches[i], function() {
				computeDuration();
			});
		}
	})();
	
	$scope.addRequiredAttr = function() {
		$scope.needHelpRequired = !$scope.needHelpRequired;
		
		// FIXME NOT an angular way!
		var input = $("[ng-model='todo.msg2GetHelp']");
		input.attr("required") ? input.removeAttr("required") : input.attr("required", 'true');
	};
	
}]);

iToDo.filter('priority', ['priorities', function(priorities) {
	return function(value) {
		debugger;
		var priority = _.find(priorities, function(priority) {
			return priority.value === value;
		});
		
		return priority.name;
	};
}]);

iToDo.filter('heart', function() {
	return function(value) {
		return value ? 'glyphicon-heart' : 'glyphicon-heart-empty';
	};
});

iToDo.filter('star', function() {
	return function(value) {
		return value ? 'glyphicon-star' : 'glyphicon-star-empty';
	};
});

//@ sourceURL=itodo-common.js