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

function SearchLeadController($scope, $location, $filter, dataService) {
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
      error : function(jqXHR) {
          sessionStorage.removeItem("username");
          sessionStorage.removeItem("access");
          $scope.$apply();
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

  $scope.$on('refreshLeads', function(e,arg){
    $scope.performSearch();
  });



  $scope.performSearch();

};

function SearchAcceptedLeadController($scope, $filter,$rootScope, dataService) {
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
    $scope.searchResults = leadStore.read();
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

  navigator.setMessageHandler("push", function(message) {
    console.log("Message received" + message.channelID);
    $scope.performSearch();

  });

  $scope.performSearch();

};

function ShowLeadController($scope, $rootScope, $routeParams, $location, $filter,
                            dataService) {
  var message = "show";
  $rootScope.$broadcast('hideNotif', message);
  var self = this;
  $scope.disabled = false;
  var leadPipe = dataService.leadPipe;
  var leadStore = dataService.leadStore;
  var saleAgentPipe = dataService.saleAgentPipe;
  var searchAgents = dataService.searchAgents;
  var sendLeads = AeroGear.Pipeline({
    name : "sendlead",
    settings : {
      endpoint : "rest/sendlead/" + $routeParams.LeadId
    }
  }).pipes.sendlead;

  $scope.get = function() {
    leadPipe.read({
      id : $routeParams.LeadId,
      success : function(data) {
        self.original = data;
        $scope.lead = data;
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
    $scope.lead.saleAgent = sessionStorage.getItem("username");
    leadPipe.save($scope.lead, {
      success : function(data) {
        leadStore.save($scope.lead);
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