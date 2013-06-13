'use strict';

function SearchLeadController($scope, $filter, dataService) {
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
	var leadPipe = dataService.leadPipe;
	var leadStore = dataService.leadStore;
	var saleAgentPipe = dataService.saleAgentPipe;
	saleAgentPipe.read({
		success : function(data) {
			$scope.saleAgentList = data;
			$scope.$apply();
		},
		statusCode : {
			401 : function(jqXHR) {
				$("#auth-error-box").modal();
			}
		}
	});

	$scope.performSearch = function() {
		leadPipe.read({
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

function NewLeadController($scope, $location, dataService) {
	var leadPipe = dataService.leadPipe;
	$scope.disabled = false;

	var saleAgentPipe = dataService.saleAgentPipe;
	saleAgentPipe.read({
		success : function(data) {
			$scope.saleAgentList = data;
			$scope.$apply();
		},
		statusCode : {
			401 : function(jqXHR) {
				$("#auth-error-box").modal();
			}
		}
	});

	$scope.save = function() {
		leadPipe.save($scope.lead, {
			success : function(data) {
				$location.path('/Leads');
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
		$location.path("/Leads");
	};
}

function EditLeadController($scope, $routeParams, $location, dataService) {
	var self = this;
	$scope.disabled = false;
	var leadPipe = dataService.leadPipe;
	var saleAgentPipe = dataService.saleAgentPipe;

	$scope.get = function() {
		leadPipe.read({
			id : $routeParams.LeadId,
			success : function(data) {
				self.original = data.entity;
				$scope.lead = data.entity;
				saleAgentPipe.read({
					success : function(data) {
						$scope.saleAgentList = data;
						angular.forEach($scope.saleAgentList, function(datum) {
							if (angular.equals(datum, $scope.lead.saleAgent)) {
								$scope.lead.saleAgent = datum;
								self.original.saleAgent = datum;
							}
						});
						$scope.$apply();
					}
				});

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
		return angular.equals(self.original, $scope.lead);
	};

	$scope.save = function() {
		leadPipe.save($scope.lead, {
			success : function(data) {
				$location.path('/Leads');
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
		$location.path("/Leads");
	};

	$scope.remove = function() {
		leadPipe.remove($scope.lead, {
			success : function(data) {
				$location.path('/Leads');
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

function ShowLeadController($scope, $routeParams, $location, $filter,
		dataService) {
	var self = this;
	$scope.disabled = false;
	var leadPipe = dataService.leadPipe;
	var saleAgentPipe = dataService.saleAgentPipe;
	var searchAgents = dataService.searchAgents;
	var sendLeads = AeroGear.Pipeline({
		name : "sendleads",
		settings : {
			endpoint : "sendleads/" + $routeParams.LeadId
		}
	}).pipes.sendleads;

	$scope.get = function() {
		leadPipe.read({
			id : $routeParams.LeadId,
			success : function(data) {
				self.original = data.entity;
				$scope.lead = data.entity;
				saleAgentPipe.read({
					success : function(data) {
						$scope.saleAgentList = data;
						angular.forEach($scope.saleAgentList, function(datum) {
							if (angular.equals(datum, $scope.lead.saleAgent)) {
								$scope.lead.saleAgent = datum;
								self.original.saleAgent = datum;
							}
						});
						$scope.$apply();
					}
				});

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
		return angular.equals(self.original, $scope.lead);
	};

	$scope.save = function() {
		leadPipe.save($scope.lead, {
			success : function(data) {
				$location.path('/Leads');
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
		$location.path("/Leads");
	};

	$scope.remove = function() {
		leadPipe.remove($scope.lead, {
			success : function(data) {
				$location.path('/Leads');
				$scope.$apply();
			},
			statusCode : {
				401 : function(jqXHR) {
					$("#auth-error-box").modal();
				}
			}
		});
	};

	$scope.searchAgents = function() {
		searchAgents.read({
			query : {
				status : $scope.status,
				location : $scope.location
			},
			success : function(data) {
				$scope.saleAgentFilteredList = data;

				$scope.$apply();
			}
		});
	};

	$scope.sendLeads = function() {
		sendLeads.save($filter('filter')($scope.saleAgentFilteredList, {
			checked : true
		}), {

			success : function(data) {

			}
		});

	};

	$scope.get();
};