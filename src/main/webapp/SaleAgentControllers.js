'use strict';

function SearchSaleAgentController($scope, $filter, dataService) {
	$scope.filter = $filter;
	$scope.search = {};
	$scope.currentPage = 0;
	$scope.pageSize = 10;
	$scope.searchResults = [];
	$scope.pageRange = [];
	$scope.numberOfPages = function() {
		var result = Math.ceil($scope.searchResults.length / $scope.pageSize);
		return (result == 0) ? 1 : result;
	};
	var saleAgentPipe = dataService.saleAgentPipe;
	var saleAgentStore = dataService.saleAgentStore;

	$scope.performSearch = function() {
		saleAgentPipe.read({
			success : function(data) {
				$scope.searchResults = data;
				var max = $scope.numberOfPages();
				$scope.pageRange = [];
				for ( var ctr = 0; ctr < max; ctr++) {
					$scope.pageRange.push(ctr);
				}
				$scope.$apply();
			},
			statusCode : {
				401 : function(jqXHR) {
					$("#auth-error-box").modal();
				}
			}
		});
	};

	$scope.previous = function() {
		if ($scope.currentPage > 0) {
			$scope.currentPage--;
		}
	};

	$scope.next = function() {
		if ($scope.currentPage < ($scope.numberOfPages() - 1)) {
			$scope.currentPage++;
		}
	};

	$scope.setPage = function(n) {
		$scope.currentPage = n;
	};

	$scope.filterSearchResults = function(result) {
		var flag = true;
		for ( var key in $scope.search) {
			if ($scope.search.hasOwnProperty(key)) {
				var expected = $scope.search[key];
				if (expected == null || expected === "") {
					continue;
				}
				var actual = result[key];
				if (angular.isObject(expected)) {
					flag = flag && angular.equals(expected, actual);
				} else {
					flag = flag
							&& (actual.toString().indexOf(expected.toString()) != -1);
				}
				if (flag === false) {
					return false;
				}
			}
		}
		return true;
	};

	$scope.performSearch();
};

function NewSaleAgentController($scope, $location, dataService) {
	var saleAgentPipe = dataService.saleAgentPipe;
	$scope.disabled = false;

	$scope.save = function() {
		saleAgentPipe.save($scope.saleAgent, {
			success : function(data) {
				$location.path('/SaleAgents');
				$scope.$apply();
			},
			statusCode : {
				401 : function(jqXHR) {
					$("#auth-error-box").modal();
				}
			}
		});
	};

	$scope.cancel = function() {
		$location.path("/SaleAgents");
	};
}

function EditSaleAgentController($scope, $routeParams, $location, dataService) {
	var self = this;
	$scope.disabled = false;
	var saleAgentPipe = dataService.saleAgentPipe;

	$scope.get = function() {
		saleAgentPipe.read({
			id : $routeParams.SaleAgentId,
			success : function(data) {
				self.original = data.entity;
				$scope.saleAgent = data.entity;

				$scope.$apply();
			},
			statusCode : {
				401 : function(jqXHR) {
					$("#auth-error-box").modal();
				}
			}
		});
	};

	$scope.isClean = function() {
		return angular.equals(self.original, $scope.saleAgent);
	};

	$scope.save = function() {
		saleAgentPipe.save($scope.saleAgent, {
			success : function(data) {
				$location.path('/SaleAgents');
				$scope.$apply();
			},
			statusCode : {
				401 : function(jqXHR) {
					$("#auth-error-box").modal();
				}
			}
		});
	};

	$scope.cancel = function() {
		$location.path("/SaleAgents");
	};

	$scope.remove = function() {
		saleAgentPipe.remove($scope.saleAgent, {
			success : function(data) {
				$location.path('/SaleAgents');
				$scope.$apply();
			},
			statusCode : {
				401 : function(jqXHR) {
					$("#auth-error-box").modal();
				}
			}
		});
	};

	$scope.get();
};