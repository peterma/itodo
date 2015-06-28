var itodoHeart = angular.module("itodo.heart", []);
itodoHeart.controller("itodoHeartController", ['$scope', function($scope) {
	
	var lastIndexHeart = 0
		, heartShapeFixed = false;

	function reset() {
		lastIndexHeart = 0
		, heartShapeFixed = false;
	}
	
	reset();
	
	$scope.$on('itodo.heart.clear', reset);
	
	$scope.$watchCollection('mood', function(newValue) {
		if(newValue) {
			for(var i = 0, length = 5; i < length; i++) {
				$scope.mood[i].value ? $scope["hear" + i] = "glyphicon-heart" : $scope["heart" + i] = "glyphicon-heart-empty";
			}
		}
	});
	
	$scope.changeHeartShape = function(index) {
		if(heartShapeFixed) {
			return;
		}
		
		if((index > lastIndexHeart && index - lastIndexHeart !== 1) || (lastIndexHeart > index && lastIndexHeart - index !== 1)) {
			return;
		}
		
		if(($scope.mood[index - 1] && $scope.mood[index-1].value) || index === 0 || (lastIndexHeart === 0 && index === 1)) {
			!$scope.mood[index].value ? $scope["heart" + index] = "glyphicon-heart" : $scope["heart" + index] = "glyphicon-heart-empty";
			$scope.mood[index].value = !$scope.mood[index].value;

		
			// 如果当前操作是去实心，则将之后的实心也去掉
			if(!$scope.mood[index].value) {
				for(var i = index + 1; i < 5; i++) {
					if($scope.mood[i].value) {
						$scope["heart" + i] = "glyphicon-heart-empty";
						$scope.mood[i].value = false;
					}
				}
			}
			
			if(lastIndexHeart === 0) {
				$scope["heart" + lastIndexHeart] = "glyphicon-heart";
				$scope.mood[lastIndexHeart].value = true;
			}
			
			lastIndexHeart = index;
		}
	};
	
	$scope.fixHeartShape = function() {
		heartShapeFixed = !heartShapeFixed;
	};	
	
}]);

itodoHeart.directive('itodoHeart', function() {
	return {
		restrict : 'EA', // E : element, A : attribute
		template : '<span ng-repeat="index in [0, 1, 2, 3, 4]" class="glyphicon" role="button" ng-class="heart{{index}}" ng-click="fixHeartShape()" ng-mouseover="changeHeartShape(index)"></span>',
		scope : {
			mood : '=mood'
		},
		controller : 'itodoHeartController',
		link : function(scope, element, attrs, ctrls) {
			
		}
	};
});

//@ sourceURL=itodo-heart.js