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

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriBuilder;

import org.jboss.aerogear.aerodoc.model.Lead;
import org.jboss.aerogear.aerodoc.service.LeadSender;
import org.jboss.aerogear.security.authz.Secure;
import org.picketlink.idm.IdentityManager;

/**
 * 
 */
@Stateless
@Path("/leads")
public class LeadEndpoint {

    @Inject
    private IdentityManager identityManager;

    @Inject
    private LeadSender leadSender;

    @PersistenceContext
    private EntityManager em;

    @OPTIONS
    public Response crossOriginForInstallations(@Context HttpHeaders headers) {
        return appendPreflightResponseHeaders(headers, Response.ok()).build();
    }

    @OPTIONS
    @Path("/{token}")
    public Response crossOriginForLead(@Context HttpHeaders headers) {
        return appendPreflightResponseHeaders(headers, Response.ok()).build();
    }

    @OPTIONS
    public Response crossOriginForLeads(@Context HttpHeaders headers) {
        return appendPreflightResponseHeaders(headers, Response.ok()).build();
    }

    @POST
    @Consumes("application/json")
    @Secure("admin")
    public Response create(Lead entity) {
      	em.persist(entity);
        return Response.created(
                UriBuilder.fromResource(LeadEndpoint.class)
                        .path(String.valueOf(entity.getId())).build()).build();
    }

    @DELETE
    @Path("/{id:[0-9][0-9]*}")
    @Secure("admin")
    public Response deleteById(@PathParam("id") Long id) {
        Lead entity = em.find(Lead.class, id);
        if (entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        em.remove(entity);
        return Response.noContent().build();
    }

    @GET
    @Path("/{id:[0-9][0-9]*}")
    @Produces("application/json")
    @Secure("simple")
    public Response findById(@PathParam("id") Long id, @Context HttpServletRequest request) {
        TypedQuery<Lead> findByIdQuery = em
                .createQuery(
                        "SELECT l FROM Lead l WHERE l.id = :entityId",
                        Lead.class);
        findByIdQuery.setParameter("entityId", id);
        Lead entity = findByIdQuery.getSingleResult();
        if (entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        return appendAllowOriginHeader(Response.ok(entity), request);
    }

    @GET
    @Produces("application/json")
    @Secure("simple")
    public Response listAll(@Context HttpServletRequest request) {
        final List<Lead> results = em.createQuery(
                "SELECT l FROM Lead l where l.saleAgent = null", Lead.class)
                .getResultList();
        return appendAllowOriginHeader(Response.ok(results), request);
    }

    @PUT
    @Path("/{id:[0-9][0-9]*}")
    @Consumes("application/json")
    @Secure("simple")
    public Response update(@PathParam("id") Long id, Lead entity, @Context HttpServletRequest request) {
        entity.setId(id);
        entity = em.merge(entity);
        //Broadcast the change to everyone
        leadSender.sendBroadCast(entity);
        return appendAllowOriginHeader(Response.noContent(), request);
    }

    @POST
    @Path("/sendleads/{id:[0-9][0-9]*}")
    @Secure("simple")
    public void sendLead(@PathParam("id") Long id, List<LinkedHashMap> agents) {
        TypedQuery<Lead> findByIdQuery = em
                .createQuery(
                        "SELECT l FROM Lead l WHERE l.id = :entityId",
                        Lead.class);
        findByIdQuery.setParameter("entityId", id);
        Lead entity = findByIdQuery.getSingleResult();
        List<String> aliases = new ArrayList<String>();
        for (LinkedHashMap hashMap : agents) {
            aliases.add(hashMap.get("loginName").toString());

        }
        leadSender.sendLeads(aliases, entity);
    }

    protected ResponseBuilder appendPreflightResponseHeaders(HttpHeaders headers,
            ResponseBuilder response) {
        // add response headers for the preflight request
        // required
        response.header("Access-Control-Allow-Origin",
                headers.getRequestHeader("Origin").get(0))
                .header("Access-Control-Allow-Methods",
                        "POST,DELETE,GET,PUT")
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