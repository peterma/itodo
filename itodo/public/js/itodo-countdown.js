var itodoCountdown = angular.module("itodo.countdown", []);
itodoCountdown.controller("itodoCountdownController", ['$scope', '$interval', function($scope, $interval) {
	
	var countdownPromise;
	
	setCountdownWatches();
	
	$scope.hasCountdown = function() {
		if($scope.countdown) {
			
			return ($scope.countdown.Y !== 0 && $scope.countdown.Y !== null) 
				|| ($scope.countdown.M !== 0 && $scope.countdown.M !== null) 
				|| ($scope.countdown.D !== 0 && $scope.countdown.D !== null) 
				|| ($scope.countdown.h !== 0 && $scope.countdown.h !== null) 
				|| ($scope.countdown.m !== 0 && $scope.countdown.m !== null) 
				|| ($scope.countdown.s !== 0 && $scope.countdown.s !== null);
		} else {
			
			return false;
		}
	};
	
	$interval.cancel(countdownPromise);
	
	function setCountdownWatches() {
		$scope.$watch('countdown.Y', function(newValue) {
			if(newValue === -1) {
				$scope.countdown.Y = 0;
			}
		});
		
		$scope.$watch('countdown.M', function(newValue) {
			if(newValue === -1) {
				$scope.countdown.M = 12;
				$scope.countdown.Y -= 1;
			}
		});
		
		$scope.$watch('countdown.D', function(newValue) {
			if(newValue === -1) {
				$scope.countdown.D = 30; // FIXME NOT PRECISE
				$scope.countdown.M -= 1;
			}
		});
		
		$scope.$watch('countdown.h', function(newValue) {
			if(newValue === -1) {
				$scope.countdown.h = 23;
				$scope.countdown.D -= 1;
			}
		});
		
		$scope.$watch('countdown.m', function(newValue) {
			if(newValue === -1) {
				$scope.countdown.m = 59;
				$scope.countdown.h -= 1;
			}
		});
		
		$scope.$watch('countdown.s', function(newValue, oldValue) {
			if(newValue === 59 && ($scope.countdown.Y || $scope.countdown.M || $scope.countdown.D || $scope.countdown.h || $scope.countdown.m)) {
				
				$scope.countdown.m -= 1;
			} else if(oldValue === 0 && (!$scope.countdown.Y && !$scope.countdown.M && !$scope.countdown.D && !$scope.countdown.h && !$scope.countdown.m)) {
				
				$scope.countdown.s = 0;
			}
		});
	}
	
	$scope.$on('itodo.countdown', countdown);
	
	function countdown($scope, newCountdown) {
		if(countdownPromise) {
			$interval.cancel(countdownPromise);
		}
		
		countdownPromise = $interval(countdownSecond, 1000);
	}
	
	function countdownSecond() {
		if($scope.countdown.s === 0) {
			$scope.countdown.s = 59;
		} else {
			$scope.countdown.s -= 1;
		}
	}
	
	$scope.$on('itodo.countdown.clear', function() {
		if(countdownPromise) {
			$interval.cancel(countdownPromise);
		}
	});
}]);

itodoCountdown.directive('itodoCountdown', function() {
	return {
		restrict : 'EA', // E : element, A : attribute
		template : '	<div ng-show="hasCountdown()">\
							<span ng-show="countdown.Y > 0">{{countdown.Y}} &nbsp; year<span ng-show="countdown.Y > 1">s</span>&nbsp;</span>\
							<span ng-show="countdown.M > 0">{{countdown.M}} &nbsp; month<span ng-show="countdown.M > 1">s</span>&nbsp;</span>\
							<span ng-show="countdown.D > 0">{{countdown.D}} &nbsp; day<span ng-show="countdown.D > 1">s</span>&nbsp;</span>\
							<span>{{countdown.h > 9 ? countdown.h : "0" + countdown.h}} &nbsp;:&nbsp;</span>\
							<span>{{countdown.m > 9 ? countdown.m : "0" + countdown.m}} &nbsp;:&nbsp;</span>\
							<span>{{countdown.s > 9 ? countdown.s : "0" + countdown.s}}</span>\
						</div>',
		scope : {
			countdown : '=countdown'
		},
		controller : 'itodoCountdownController',
		link : function(scope, element, attrs, ctrls) {
			
		}
	};
});

//@ sourceURL=itodo-countdown.js