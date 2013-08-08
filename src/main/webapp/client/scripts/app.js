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

var aeroConfig = {
	serverURL : "http://192.168.1.19:8080",
	simplePushServerURL : "http://192.168.1.19:7777/simplepush",
	pushServerURL : "http://192.168.1.19:8080/ag-push",
	variantID : "ba3cfa4b-7f47-44a1-bdae-0dc36041bdb2",
	variantSecret : "1161fa49-2c5b-4101-8102-ea747606d333"
}

var aerodoc = angular.module('aerodoc', [ 'aerodoc.filters' ]).config(
		[ '$routeProvider', function($routeProvider) {
			$routeProvider.when('/Leads', {
				templateUrl : 'partials/Lead/search.html',
				controller : SearchLeadController
			}).when('/Leads/show/:LeadId', {
				templateUrl : 'partials/Lead/show.html',
				controller : ShowLeadController
			}).when('/Leads/accepted', {
				templateUrl : 'partials/Lead/searchlocal.html',
				controller : SearchAcceptedLeadController
			}).when('/SaleAgents/edit/:SaleAgentId', {
				templateUrl : 'partials/SaleAgent/detail.html',
				controller : EditSaleAgentController
			}).otherwise({
				templateUrl : 'partials/Lead/search.html',
				controller : SearchLeadController
			});
		} ]);
