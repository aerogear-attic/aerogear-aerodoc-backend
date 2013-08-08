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

function ShowNotificationController($scope, $rootScope, $routeParams, $location,
		dataService) {
	var showBar = false;
    $scope.$on('loginDone', function(e,arg){
    navigator.setMessageHandler("push", function(message) {
		console.log("Message received" + message.channelID);
		showBar = true;
		var message = "refresh";
		$rootScope.$broadcast('refreshLeads', message);
	});
    });
	$scope.$on('hideNotif', function(e,arg){
		showBar = false;
	});

	$scope.showNotification = function() {
		return showBar;
	};

}