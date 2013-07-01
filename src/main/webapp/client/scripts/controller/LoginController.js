'use strict';

function LoginController($scope, $routeParams, $location, dataService) {

	var restAuth = dataService.restAuth;

	$scope.login = function() {
		sessionStorage.removeItem("username");
		sessionStorage.removeItem("access");
		var user = $scope.user;
		restAuth.login(user, {
			contentType: "application/json",
			success : function(data) {
				var role = $.inArray("admin", data.roles) >= 0 ? 1 : 0;
				sessionStorage.setItem("username", data.loginName);
				sessionStorage.setItem("access", role);
				$location.path('/Leads');
				$scope.$apply();
			},
			error : function(data) {

			}
		});
	};

	$scope.enroll = function() {
		sessionStorage.removeItem("username");
		sessionStorage.removeItem("access");
		var user = $scope.user;
		restAuth.enroll(user, {
			success : function(data) {
				var role = $.inArray("admin", data.roles) >= 0 ? 1 : 0;
				sessionStorage.setItem("username", data.loginName);
				sessionStorage.setItem("access", role);
				$scope.$apply();
			},
			error : function(data) {

			}
		});
	};

	$scope.logout = function() {
		sessionStorage.removeItem("username");
		sessionStorage.removeItem("access");
		var user = $scope.user;
		restAuth.logout();
	};

	$scope.isAdmin = function() {
		return sessionStorage.getItem("access") == 1;
	};

	$scope.isLoggedIn = function() {
		return sessionStorage.getItem("username") != undefined;
	};
};