'use strict';

function ShowNotificationController($scope, $rootScope, $routeParams, $location,
		dataService) {
	var showBar = false;
	navigator.setMessageHandler("push", function(message) {
		console.log("Message received" + message.channelID);
		showBar = true;
		var message = "refresh";
		$rootScope.$broadcast('refreshLeads', message);
		$scope.$apply();

	});
	
	$scope.$on('hideNotif', function(e,arg){
		showBar = false;
		$scope.$apply();
	});

	$scope.showNotification = function() {
		return showBar;
	};

}