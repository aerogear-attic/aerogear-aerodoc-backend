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

var aerodoc = angular.module('aerodoc', [ 'aerodoc.filters' ]).config(
		[ '$routeProvider', function($routeProvider) {
			$routeProvider.when('/Leads', {
				templateUrl : 'partials/Lead/search.html',
				controller : SearchLeadController
			}).when('/Leads/new', {
				templateUrl : 'partials/Lead/detail.html',
				controller : NewLeadController
			}).when('/Leads/edit/:LeadId', {
				templateUrl : 'partials/Lead/detail.html',
				controller : EditLeadController
			}).when('/Leads/show/:LeadId', {
				templateUrl : 'partials/Lead/show.html',
				controller : ShowLeadController
			}).when('/SaleAgents', {
				templateUrl : 'partials/SaleAgent/search.html',
				controller : SearchSaleAgentController
			}).when('/SaleAgents/new', {
				templateUrl : 'partials/SaleAgent/detail.html',
				controller : NewSaleAgentController
			}).when('/SaleAgents/edit/:SaleAgentId', {
				templateUrl : 'partials/SaleAgent/detail.html',
				controller : EditSaleAgentController
			}).when('/pushconfig', {
				templateUrl : 'partials/PushConfig/search.html',
				controller : SearchPushConfigController
			}).when('/pushconfig/new', {
				templateUrl : 'partials/PushConfig/detail.html',
				controller : NewPushConfigController
			}).when('/pushconfig/edit/:PushConfigId', {
				templateUrl : 'partials/PushConfig/detail.html',
				controller : EditPushConfigController
			}).otherwise({
				templateUrl : 'partials/Lead/search.html',
				controller : SearchLeadController
			});
		} ]);
