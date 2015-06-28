var itodoDatetime = angular.module("itodo.datetime", []);
itodoDatetime.controller("itodoDatetimeController", ['$scope', function($scope) {
	
	$scope.years = []
	, $scope.months = []
	, $scope.days = []
	, $scope.hours = []
	, $scope.minutes = []
	, $scope.seconds = [];
	
	// TODO No magic numbers
	for(var i = 2015; i <= 2020; i++) {
		$scope.years.push({value : i, text : i});
	};
	
	for(var j = 1; j <= 12; j++) {
		$scope.months.push({value : j, text : j});
	};
	
	for(var k = 1; k <= 30; k++) {
		$scope.days.push({value : k, text : k});
	};
	
	for(var l = 0; l < 24; l++) {
		$scope.hours.push({value : l, text : getText(l)});
	};
	
	for(var m = 0; m < 60; m++) {
		$scope.minutes.push({value : m, text : getText(m)});
	};
	
	for(var n = 0; n < 60; n++) {
		$scope.seconds.push({value : n, text : getText(n)});
	};
	
	function getText(n) {
		return n < 10 ? '0' + n : n;
	}
	
}]);

itodoDatetime.directive('itodoDatetime', function() {
	return {
		restrict : 'EA', // E : element, A : attribute
		template : '	<select ng-model="todoDate.year" ng-options="year.value as year.text for year in years"></select>\
						<select ng-model="todoDate.month" ng-options="month.value as month.text for month in months"></select>\
						<select ng-model="todoDate.day" ng-options="day.value as day.text for day in days"></select>\
						<select ng-model="todoDate.hour" ng-options="hour.value as hour.text for hour in hours"></select>\
						<select ng-model="todoDate.minute" ng-options="minute.value as minute.text for minute in minutes"></select>\
						<select ng-model="todoDate.second" ng-options="second.value as second.text for second in seconds"></select>',
		scope : {
			todoDate : '=todoDate'
		},
		controller : 'itodoDatetimeController',
		link : function(scope, element, attrs, ctrls) {
			
		}
	};
});

//@ sourceURL=itodo-datetime.js