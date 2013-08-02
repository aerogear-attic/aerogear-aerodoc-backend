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

import org.jboss.aerogear.aerodoc.cdi.qualifiers.PicketlinkDB;
import org.jboss.aerogear.aerodoc.model.SaleAgent;
import org.jboss.aerogear.security.authz.Secure;
import org.picketlink.idm.IdentityManager;
import org.picketlink.idm.model.Attribute;
import org.picketlink.idm.model.IdentityType;
import org.picketlink.idm.model.User;
import org.picketlink.idm.query.IdentityQuery;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriBuilder;
import java.util.ArrayList;
import java.util.List;

/**
 * 
 */
@Stateless
@Path("/saleagents")
@Secure("admin")
public class SaleAgentEndpoint {

    @Inject
    private IdentityManager identityManager;

    @Inject @PicketlinkDB
    private EntityManager em;

    @POST
    @Consumes("application/json")
    public Response create(SaleAgent entity) {
        em.persist(entity);
        return Response.created(
                UriBuilder.fromResource(SaleAgentEndpoint.class)
                        .path(String.valueOf(entity.getId())).build()).build();
    }

    @DELETE
    @Path("/{id:[0-9][0-9]*}")
    public Response deleteById(@PathParam("id") Long id) {
        SaleAgent entity = em.find(SaleAgent.class, id);
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
        TypedQuery<SaleAgent> findByIdQuery = em.createQuery(
                "SELECT s FROM SaleAgent s WHERE s.id = :entityId",
                SaleAgent.class);
        findByIdQuery.setParameter("entityId", id);
        SaleAgent entity = findByIdQuery.getSingleResult();
        if (entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        return Response.ok(entity).build();
    }

    @GET
    @Produces("application/json")
    public List<SaleAgent> listAll() {
        final List<SaleAgent> results = em.createQuery(
                "SELECT s FROM SaleAgent s", SaleAgent.class).getResultList();
        return results;
    }

    @PUT
    @Path("/{id}")
    @Consumes("application/json")
    @Secure("simple")
    public Response update(@PathParam("id") String id, SaleAgent entity) {
        User user = identityManager.getUser(entity.getLoginName());
        Attribute<String> attributeStatus = user.getAttribute("status");
        attributeStatus.setValue(entity.getStatus());
        Attribute<String> attributeLocation = user.getAttribute("location");
        attributeLocation.setValue(entity.getLocation());
        identityManager.update(user);
        return Response.noContent().build();
    }

    @GET
    @Path("/searchAgents")
    @Produces("application/json")
    public List<SaleAgent> listByCriteria(@DefaultValue("") @QueryParam("status") String status, @DefaultValue("") @QueryParam("location") String location) {

        IdentityQuery<User> query = identityManager
                .createIdentityQuery(User.class);

        if (!status.isEmpty()) {
            query.setParameter(IdentityType.ATTRIBUTE.byName("status"),
                    new Object[] { status });
        }
        if (!location.isEmpty()) {
            query.setParameter(IdentityType.ATTRIBUTE.byName("location"),
                    new Object[] { location });
        }
        List<User> users = query.getResultList();
        List<SaleAgent> saleAgents = new ArrayList<SaleAgent>();
        for (User user : users) {
            SaleAgent agent = new SaleAgent();
            agent.setLoginName(user.getLoginName());
            agent.setAttribute(user.getAttribute("location"));
            agent.setAttribute(user.getAttribute("status"));
            saleAgents.add(agent);
        }
        return saleAgents;

    }

}