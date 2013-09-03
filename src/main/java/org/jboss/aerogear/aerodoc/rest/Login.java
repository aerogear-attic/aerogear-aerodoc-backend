/**
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
package org.jboss.aerogear.aerodoc.rest;

import org.jboss.aerogear.aerodoc.model.SaleAgent;
import org.jboss.aerogear.security.auth.AuthenticationManager;
import org.picketlink.Identity;
import org.picketlink.Identity.AuthenticationResult;
import org.picketlink.credential.DefaultLoginCredentials;
import org.picketlink.idm.IdentityManager;
import org.picketlink.idm.model.IdentityType;
import org.picketlink.idm.model.basic.Agent;
import org.picketlink.idm.model.basic.BasicModel;
import org.picketlink.idm.model.basic.User;
import org.picketlink.idm.query.IdentityQuery;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import java.util.List;
import java.util.logging.Logger;

@Stateless
@Path("/")
public class Login extends AerodocBaseEndpoint {

	private static final Logger LOGGER = Logger.getLogger(Login.class
			.getSimpleName());

	@Inject
	private AuthenticationManager authenticationManager;

	@Inject
	private IdentityManager identityManager;

	@Inject
	private Identity identity;

	@Inject
	private DefaultLoginCredentials credentials;

	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(final SaleAgent user,
			@Context HttpServletRequest request) {
		SaleAgent saleAgent = null;
		String id = user.getLoginName();
		if (!this.identity.isLoggedIn()) {
			this.credentials.setUserId(user.getLoginName());
			this.credentials.setPassword(user.getPassword());
			AuthenticationResult result = this.identity.login();
			LOGGER.info("Login result : " + result);
			if(result==AuthenticationResult.SUCCESS){
				 List<SaleAgent> list = identityManager.createIdentityQuery(SaleAgent.class)
			                .setParameter(SaleAgent.LOGIN_NAME, user.getLoginName()).getResultList();
				saleAgent = list.get(0);
			}
			else {
				LOGGER.severe("Login failed !");
			}
		} else {
			throw new RuntimeException("Authentication failed");
		}

		return appendAllowOriginHeader(Response.ok(saleAgent), request);
	}

	@POST
	@Path("/logout")
	public void logout() {
		LOGGER.info("User logout!");
		authenticationManager.logout();
	}

	@OPTIONS
	@Path("/login")
	public Response crossOriginForInstallations(@Context HttpHeaders headers) {
		return appendPreflightResponseHeaders(headers, Response.ok()).build();

	}

}
