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
import org.jboss.aerogear.aerodoc.config.RequiresAccount;
import org.jboss.aerogear.aerodoc.model.SaleAgent;
import org.jboss.aerogear.aerodoc.model.entity.SalesAgentEntity;
import org.picketlink.idm.IdentityManager;
import org.picketlink.idm.model.IdentityType;
import org.picketlink.idm.query.IdentityQuery;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
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
public class SaleAgentEndpoint {

    @Inject
    private IdentityManager identityManager;

    @PersistenceContext
    private EntityManager em;

    @POST
    @Consumes("application/json")
    @RequiresAccount
    public Response create(SaleAgent entity) {
        em.persist(entity);
        return Response.created(
                UriBuilder.fromResource(SaleAgentEndpoint.class)
                        .path(String.valueOf(entity.getId())).build()).build();
    }

    @DELETE
    @Path("/{id:[0-9a-z\\-]*}")
    @RequiresAccount
    public Response deleteById(@PathParam("id") String id) {
        SalesAgentEntity entity = em.find(SalesAgentEntity.class, id);
        if (entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        em.remove(entity);
        return Response.noContent().build();
    }

    @GET
    @Path("/{id:[0-9a-z\\-]*}")
    @Produces("application/json")
    @RequiresAccount
    public Response findById(@PathParam("id") String id) {
        TypedQuery<SalesAgentEntity> findByIdQuery = em.createQuery(
                "SELECT s FROM SalesAgentEntity s WHERE s.id = :entityId",
                SalesAgentEntity.class);
        findByIdQuery.setParameter("entityId", id);
        try {
          SalesAgentEntity entity = findByIdQuery.getSingleResult();
          return Response.ok(entity).build();
        } catch (NoResultException e) {
          return Response.status(Status.NOT_FOUND).build();
        }
    }


    @GET
    @Produces("application/json")
    @RequiresAccount
    public Response listAll() {
        final List<SalesAgentEntity> results = em.createQuery(
                "SELECT s FROM SalesAgentEntity s", SalesAgentEntity.class).getResultList();
        return Response.ok(results).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes("application/json")
    @RequiresAccount
    public Response update(@PathParam("id") String id, SaleAgent entity,
            @Context HttpServletRequest request) {
    	SalesAgentEntity user = em.find(SalesAgentEntity.class, id);
        user.setLocation(entity.getLocation());
    	user.setStatus(entity.getStatus());
        user.setLatitude(entity.getLatitude());
        user.setLongitude(entity.getLongitude());
        em.merge(user);
        return Response.noContent().build();
    }

    @GET
    @Path("/searchAgents")
    @Produces("application/json")
    @RequiresAccount
    public List<SaleAgent> listByCriteria(
            @DefaultValue("") @QueryParam("status") String status,
            @DefaultValue("") @QueryParam("location") String location) {

        IdentityQuery<SaleAgent> query = identityManager
                .createIdentityQuery(SaleAgent.class);

        if (!status.isEmpty()) {
            query.setParameter(IdentityType.QUERY_ATTRIBUTE.byName("status"), status);
        }
        if (!location.isEmpty()) {
            query.setParameter(IdentityType.QUERY_ATTRIBUTE.byName("location"), location);
        }
        return query.getResultList();
    }

    @GET
    @Path("/searchAgentsInRange")
    @Produces("application/json")
    @SuppressWarnings("unchecked")
    @RequiresAccount
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