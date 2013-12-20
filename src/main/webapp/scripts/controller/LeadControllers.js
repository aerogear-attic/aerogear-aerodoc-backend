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
					var restAuth = dataService.restAuth;
					restAuth.logout();
					sessionStorage.removeItem("username");
					sessionStorage.removeItem("access");
					$scope.$apply();
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

	
	$scope.save = function() {
		leadPipe.save($scope.lead, {
			success : function(data) {
				$location.path('/Leads');
				$scope.$apply();
			},
			statusCode : {
				401 : function(jqXHR) {
					$("#auth-error-box").modal();
					var restAuth = dataService.restAuth;
					restAuth.logout();
					sessionStorage.removeItem("username");
					sessionStorage.removeItem("access");
					$scope.$apply();
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
				$scope.$apply();
			},
			statusCode : {
				401 : function(jqXHR) {
					$("#auth-error-box").modal();
					var restAuth = dataService.restAuth;
					restAuth.logout();
					sessionStorage.removeItem("username");
					sessionStorage.removeItem("access");
					$scope.$apply();
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
					var restAuth = dataService.restAuth;
					restAuth.logout();
					sessionStorage.removeItem("username");
					sessionStorage.removeItem("access");
					$scope.$apply();
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
					var restAuth = dataService.restAuth;
					restAuth.logout();
					sessionStorage.removeItem("username");
					sessionStorage.removeItem("access");
					$scope.$apply();
				}
			}
		});
	};

	$scope.get();
};

function ShowLeadController($scope, $routeParams, $location, $filter,
		dataService) {
    var map = new AeroGear.Map();

	var self = this;
	$scope.disabled = false;
	var leadPipe = dataService.leadPipe;
	var saleAgentPipe = dataService.saleAgentPipe;
	var searchAgents = dataService.searchAgents;
	var sendLeads = AeroGear.Pipeline({
		name : "sendleads",
		settings : {
			endpoint : "rest/leads/sendleads/" + $routeParams.LeadId
		}
	}).pipes.sendleads;

    function searchAgentsInRange(location, radius) {
        var searchAgents = AeroGear.Pipeline({
            name: "searchAgents",
            settings: {
                endpoint: "rest/saleagents/searchAgentsInRange/"
            }
        }).pipes.searchAgents;

        searchAgents.read({
            query: {
                latitude: location.lat,
                longitude: location.lon,
                radius: radius
            },
            success: function (data) {
                $scope.saleAgentFilteredList = data;
                $scope.$apply();
            }
        });
    }

    function findLocation(address) {
        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&sensor=false',
            function (data) {
                if (data.status === "OK") {
                    var fromJson = data.results[0].geometry.location,
                        location = new OpenLayers.LonLat(fromJson.lng, fromJson.lat)
                            .transform(
                                new OpenLayers.Projection("EPSG:4326"),
                                map.getProjectionObject()
                            );
                    var initialRadius = 1000;
                    map.drawGeoFence(location, initialRadius);
                    map.addFenceModificationListener(function (center, radius) {
                        var location = center.transform(
                            map.getProjectionObject(),
                            new OpenLayers.Projection("EPSG:4326")
                        );
                        searchAgentsInRange(location, radius);
                    });
                    searchAgentsInRange(location, initialRadius);
                }
            });
    }

	$scope.get = function() {
		leadPipe.read({
			id : $routeParams.LeadId,
			success : function(data) {
				self.original = data;
				$scope.lead = data;
                findLocation($scope.lead.location);
				$scope.$apply();
			},
			statusCode : {
				401 : function(jqXHR) {
					$("#auth-error-box").modal();
					var restAuth = dataService.restAuth;
					restAuth.logout();
					sessionStorage.removeItem("username");
					sessionStorage.removeItem("access");
					$scope.$apply();
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
					var restAuth = dataService.restAuth;
					restAuth.logout();
					sessionStorage.removeItem("username");
					sessionStorage.removeItem("access");
					$scope.$apply();
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
					var restAuth = dataService.restAuth;
					restAuth.logout();
					sessionStorage.removeItem("username");
					sessionStorage.removeItem("access");
					$scope.$apply();
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