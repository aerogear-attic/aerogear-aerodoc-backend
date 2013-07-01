'use strict';

function ShowNotificationController($scope, $routeParams, $location,
		dataService) {
	var showBar = false;
	navigator.setMessageHandler("push", function(message) {
		console.log("Message received" + message.channelID);
		showBar = true;
		$location.path('/Leads');
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