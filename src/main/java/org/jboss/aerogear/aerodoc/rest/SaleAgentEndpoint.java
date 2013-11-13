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

import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.Search;
import org.hibernate.search.query.dsl.QueryBuilder;
import org.hibernate.search.query.dsl.Unit;
import org.jboss.aerogear.aerodoc.model.SaleAgent;
import org.jboss.aerogear.aerodoc.model.entity.SalesAgentEntity;
import org.jboss.aerogear.security.authz.Secure;
import org.picketlink.idm.IdentityManager;
import org.picketlink.idm.model.IdentityType;
import org.picketlink.idm.query.IdentityQuery;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriBuilder;
import java.util.List;

/**
 *
 */
@Stateless
@Path("/saleagents")
@Secure("admin")
public class SaleAgentEndpoint extends AerodocBaseEndpoint {

    @Inject
    private IdentityManager identityManager;

    @PersistenceContext
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
    public Response update(@PathParam("id") String id, SaleAgent entity,
            @Context HttpServletRequest request) {
    	SaleAgent user; 
    	List<SaleAgent> list = identityManager.createIdentityQuery(SaleAgent.class)
	                .setParameter(SaleAgent.LOGIN_NAME, entity.getLoginName()).getResultList();
    	user = list.get(0);
    	user.setLocation(entity.getLocation());
    	user.setStatus(entity.getStatus());
        identityManager.update(user);
        return appendAllowOriginHeader(Response.noContent(), request);
    }

    @GET
    @Path("/searchAgents")
    @Produces("application/json")
    public List<SaleAgent> listByCriteria(
            @DefaultValue("") @QueryParam("status") String status,
            @DefaultValue("") @QueryParam("location") String location) {

        IdentityQuery<SaleAgent> query = identityManager
                .createIdentityQuery(SaleAgent.class);

        if (!status.isEmpty()) {
            query.setParameter(IdentityType.QUERY_ATTRIBUTE.byName("status"),
                    new Object[]{status});
        }
        if (!location.isEmpty()) {
            query.setParameter(IdentityType.QUERY_ATTRIBUTE.byName("location"),
                    new Object[]{location});
        }
        List<SaleAgent> users = query.getResultList();
        return users;

    }

    @GET
    @Path("/searchAgentsInRange")
    @Produces("application/json")
    @SuppressWarnings("unchecked")
    public List<SaleAgent> listByCriteria(@QueryParam("latitude") Double latitude,
            @QueryParam("longitude") Double longitude, @QueryParam("radius") Double radius) {

      FullTextEntityManager fullText = Search.getFullTextEntityManager(em);
      QueryBuilder builder = fullText.getSearchFactory()
          .buildQueryBuilder().forEntity( SalesAgentEntity.class ).get();

      org.apache.lucene.search.Query luceneQuery = builder.spatial()
          .onDefaultCoordinates()
          .within(radius, Unit.KM)
          .ofLatitude(latitude)
          .andLongitude(longitude)
          .createQuery();

      Query query = fullText.createFullTextQuery(luceneQuery, SalesAgentEntity.class);
      return query.getResultList();
    }

}