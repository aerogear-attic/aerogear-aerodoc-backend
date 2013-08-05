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

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

/**
 * The pupose of this class is to offer CORS support. All the OPTIONS requests,
 * no matter the path, will be handled in this class. It also offers convenient
 * method to append the allow origin header to any request. Any Endpoint class
 * that would like CORS support should extends this class.
 */
@Path("{path : .*}")
public abstract class AerodocBaseEndpoint {

    /**
     * All the OPTIONS requests will hit this method, the wildcard path defined
     * on class level make it useless to define different path patterns.
     */
    @OPTIONS
    public Response crossOriginForInstallations(@Context HttpHeaders headers) {
        return appendPreflightResponseHeaders(headers, Response.ok()).build();
    }

    protected ResponseBuilder appendPreflightResponseHeaders(HttpHeaders headers,
            ResponseBuilder response) {
        // add response headers for the preflight request
        // required
        response.header("Access-Control-Allow-Origin",
                headers.getRequestHeader("Origin").get(0))
                .header("Access-Control-Allow-Methods",
                        "POST, DELETE, GET, PUT")
                .header("Access-Control-Allow-Headers",
                        "accept, origin, content-type, authorization")
                .header("Access-Control-Allow-Credentials", "true");

        return response;
    }

    /**
     * This convenient method will append to the response headers the needed
     * CORS headers
     */
    protected Response appendAllowOriginHeader(ResponseBuilder rb,
            HttpServletRequest request) {

        return rb
                .header("Access-Control-Allow-Origin",
                        request.getHeader("Origin")) // return submitted origin
                .header("Access-Control-Allow-Credentials", "true").build();
    }
}
