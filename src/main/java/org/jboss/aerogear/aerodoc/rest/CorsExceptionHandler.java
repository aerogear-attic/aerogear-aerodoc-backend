package org.jboss.aerogear.aerodoc.rest;

import javax.ejb.EJBException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import org.jboss.resteasy.spi.UnauthorizedException;

@Provider
public class CorsExceptionHandler implements ExceptionMapper<EJBException> {
    @Override
    public Response toResponse(final EJBException exception) {
        System.out.println("Handling Unauthorized exception");
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