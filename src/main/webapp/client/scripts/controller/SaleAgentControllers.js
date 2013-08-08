/*
 * JBoss, Home of Professional Open Source
 * Copyright Red Hat, Inc., and individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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