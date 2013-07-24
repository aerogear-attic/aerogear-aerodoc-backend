"use strict";

aerodoc.factory("dataService", function() {
	return {
		restAuth : AeroGear.Auth({
			name : "auth",
			settings : {
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
				authenticator : this.restAuth
			}
		}).pipes.leads,
		
		pushPipe: AeroGear.Pipeline({
			name : "pushconfig",
			settings : {
				authenticator : this.restAuth
			}
		}).pipes.pushconfig,

		searchAgents : AeroGear.Pipeline({
			name : "searchAgents",
			settings : {
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