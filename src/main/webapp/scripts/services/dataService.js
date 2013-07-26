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
"use strict";

aerodoc.factory("dataService", function() {
	var baseURL  = "http://localhost:8080/aerodoc/rest/";
	return {
		restAuth : AeroGear.Auth({
			name : "auth",
			settings : {
				baseURL : baseURL,
				agAuth : true,
				endpoints : {
					enroll : "register",
					login : "login",
					logout : "logout"
				}
			}
		}).modules.auth,
		leadPipe : AeroGear.Pipeline({
			name : "leads",
			settings : {
				baseURL : baseURL,
				authenticator : this.restAuth
			}
		}).pipes.leads,
		
		pushPipe: AeroGear.Pipeline({
			name : "pushconfig",
			settings : {
				baseURL : baseURL,
				authenticator : this.restAuth
			}
		}).pipes.pushconfig,

		searchAgents : AeroGear.Pipeline({
			name : "searchAgents",
			settings : {
				baseURL : baseURL + "saleagents/",
				authenticator : this.restAuth
			}
		}).pipes.searchAgents,

		leadStore : AeroGear.DataManager({
			name : "Lead",
			type : "SessionLocal",
			settings : {
				storageType : "localStorage"
			}
		}).stores.Lead,
		saleAgentPipe : AeroGear.Pipeline({
			name : "saleagents",
			settings : {
				baseURL : baseURL,
				authenticator : this.restAuth
			}
		}).pipes.saleagents,

		saleAgentStore : AeroGear.DataManager({
			name : "SaleAgent",
			type : "SessionLocal",
			settings : {
				storageType : "localStorage"
			}
		}).stores.SaleAgent
	};
});