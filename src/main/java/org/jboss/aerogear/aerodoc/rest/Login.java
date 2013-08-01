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
import org.jboss.aerogear.security.exception.AeroGearSecurityException;
import org.picketlink.idm.IdentityManager;
import org.picketlink.idm.model.User;

import javax.ejb.Stateless;
import javax.enterprise.event.Event;
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
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import java.util.logging.Logger;

@Stateless
@Path("/")
public class Login {

    private static final Logger LOGGER = Logger.getLogger(Login.class.getSimpleName());

    @Inject
    private AuthenticationManager authenticationManager;

    @Inject
    private IdentityManager identityManager;

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(final SaleAgent user, @Context HttpServletRequest request) {
        try {
            performLogin(user);
        } catch (AeroGearSecurityException agse) {
            return Response.status(Status.UNAUTHORIZED).build();
        }
        return appendAllowOriginHeader(Response.ok(user),request);
    }

    @POST
    @Path("/logout")
    public void logout() {
        LOGGER.info("User logout!");
        authenticationManager.logout();
    }

    private void performLogin(SaleAgent saleAgent) {
        authenticationManager.login(saleAgent, saleAgent.getPassword());
        //workaround to load the extra attributes, maybe a bug ??
        User user = identityManager.getUser(saleAgent.getLoginName());
        saleAgent.setLocation(user.getAttribute("location").getValue().toString());
        saleAgent.setStatus(user.getAttribute("status").getValue().toString());
        saleAgent.setId(user.getId());
    }
    
    @OPTIONS
    @Path("/login")
	public Response crossOriginForInstallations(@Context HttpHeaders headers) {
    	return appendPreflightResponseHeaders(headers, Response.ok()).build();
	}

	private ResponseBuilder appendPreflightResponseHeaders(HttpHeaders headers,
			ResponseBuilder response) {
		// add response headers for the preflight request
		// required
		response.header("Access-Control-Allow-Origin",
				headers.getRequestHeader("Origin").get(0))
				.header("Access-Control-Allow-Methods", "POST, DELETE, GET, PUT")
				.header("Access-Control-Allow-Headers",
						"accept, origin, content-type, authorization")
				.header("Access-Control-Allow-Credentials", "true");

		return response;
	}
	
	protected Response appendAllowOriginHeader(ResponseBuilder rb, HttpServletRequest request) {

        return rb.header("Access-Control-Allow-Origin", request.getHeader("Origin")) // return submitted origin
                .header("Access-Control-Allow-Credentials", "true")
                 .build();
    }

}
