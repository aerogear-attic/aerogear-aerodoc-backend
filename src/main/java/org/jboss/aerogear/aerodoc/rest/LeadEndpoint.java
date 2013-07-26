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
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
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
@Secure("simple")
public class LeadEndpoint {

    @Inject
    private IdentityManager identityManager;

    @Inject
    private LeadSender leadSender;

    @PersistenceContext(unitName = "aerodoc-default")
    private EntityManager em;

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
    public Response findById(@PathParam("id") Long id) {
        TypedQuery<Lead> findByIdQuery = em
                .createQuery(
                        "SELECT l FROM Lead l WHERE l.id = :entityId",
                        Lead.class);
        findByIdQuery.setParameter("entityId", id);
        Lead entity = findByIdQuery.getSingleResult();
        if (entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        return Response.ok(entity).build();
    }

    @GET
    @Produces("application/json")
    public List<Lead> listAll() {
        final List<Lead> results = em.createQuery(
                "SELECT l FROM Lead l where l.saleAgent = null", Lead.class)
                .getResultList();
        return results;
    }

    @PUT
    @Path("/{id:[0-9][0-9]*}")
    @Consumes("application/json")
    public Response update(@PathParam("id") Long id, Lead entity) {
        entity.setId(id);
        entity = em.merge(entity);
        //Broadcast the change to everyone
        leadSender.sendBroadCast(entity);
        return Response.noContent().build();
    }

    @POST
    @Path("/sendleads/{id:[0-9][0-9]*}")
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
}