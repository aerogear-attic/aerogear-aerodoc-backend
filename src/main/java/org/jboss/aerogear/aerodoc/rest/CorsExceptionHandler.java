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

import javax.ejb.EJBException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import org.jboss.resteasy.spi.UnauthorizedException;

/**
 * The purpose of this class is to handle Exceptions thrown by Resteasy and
 * to deal with CORS information in order to return a correct 401 response to the client
 */
@Provider
public class CorsExceptionHandler implements ExceptionMapper<EJBException> {

    /**
     * Map an exception to a {@link javax.ws.rs.core.Response} and put the CORS 
     * info into the headers 
     * 
     */
    @Override
    public Response toResponse(final EJBException exception) {
        if (exception.getCause() instanceof UnauthorizedException) {
            return Response.status(Status.UNAUTHORIZED).entity(exception.getMessage())
                    .header("Access-Control-Allow-Origin", "*")
                    .header("Access-Control-Allow-Credentials", "true").build();
        }

        return Response.status(Status.BAD_REQUEST).entity(exception.getMessage())
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Credentials", "true").build();
    }
}