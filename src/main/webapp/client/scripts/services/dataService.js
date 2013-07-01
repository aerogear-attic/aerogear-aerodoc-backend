"use strict";

prodoctor.factory("dataService", function() {
	return {
		restAuth : AeroGear.Auth({
			name : "auth",
			settings : {
				agAuth : true,
				baseURL : "http://localhost:8080/prodoctor/",
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
				baseURL : "http://localhost:8080/prodoctor/",
				endpoint : "leads",
				authenticator : this.restAuth
			}
		}).pipes.leads,

		searchAgents : AeroGear.Pipeline({
			name : "searchAgents",
			settings : {
				authenticator : this.restAuth,
				endpoint: "rest/saleagents/searchagents",
				baseURL : "http://localhost:8080/prodoctor/"
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
			name : "rest/saleagents",
			settings : {
				authenticator : this.restAuth,
				baseURL : "http://localhost:8080/prodoctor/"
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