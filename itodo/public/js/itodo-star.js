var itodoStar = angular.module("itodo.star", []);
itodoStar.controller("itodoStarController", ['$scope', function($scope) {
	
	var lastIndexStar = 0
		, starShapeFixed = false;

	function reset() {
		lastIndexStar = 0
		, starShapeFixed = false;
	}
	
	reset();
	
	$scope.$on('itodo.star.clear', reset);
	
	$scope.$watchCollection('confidence', function(newValue) {
		if(newValue) {
			for(var i = 0, length = 5; i < length; i++) {
				$scope.confidence[i].value ? $scope["star" + i] = "glyphicon-star" : $scope["star" + i] = "glyphicon-star-empty";
			}
		}
	});
	
	$scope.changeStarShape = function(index) {
		if(starShapeFixed) {
			return;
		}
		
		if((index > lastIndexStar && index - lastIndexStar !== 1) || (lastIndexStar > index && lastIndexStar - index !== 1)) {
			return;
		}
		
		if(($scope.confidence[index - 1] && $scope.confidence[index-1].value) || index === 0 || (lastIndexStar === 0 && index === 1)) {
			!$scope.confidence[index].value ? $scope["star" + index] = "glyphicon-star" : $scope["star" + index] = "glyphicon-star-empty";
			$scope.confidence[index].value = !$scope.confidence[index].value;

		
			// 如果当前操作是去实心，则将之后的实心也去掉
			if(!$scope.confidence[index].value) {
				for(var i = index + 1; i < 5; i++) {
					if($scope.confidence[i].value) {
						$scope["star" + i] = "glyphicon-star-empty";
						$scope.confidence[i].value = false;
					}
				}
			}
			
			if(lastIndexStar === 0) {
				$scope["star" + lastIndexStar] = "glyphicon-star";
				$scope.confidence[lastIndexStar].value = true;
			}
			
			lastIndexStar = index;
		}
	};
	
	$scope.fixStarShape = function() {
		starShapeFixed = !starShapeFixed;
	};	
	
}]);

itodoStar.directive('itodoStar', function() {
	return {
		restrict : 'EA', // E : element, A : attribute
		template : '<span ng-repeat="index in [0, 1, 2, 3, 4]" class="glyphicon" role="button" ng-class="star{{index}}" ng-click="fixStarShape()" ng-mouseover="changeStarShape(index)"></span>',
		scope : {
			confidence : '=confidence'
		},
		controller : 'itodoStarController',
		link : function(scope, element, attrs, ctrls) {
			
		}
	};
});

//@ sourceURL=itodo-star.js