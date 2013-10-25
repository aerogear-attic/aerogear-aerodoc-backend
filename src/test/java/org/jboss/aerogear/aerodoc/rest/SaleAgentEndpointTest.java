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
import org.jboss.aerogear.aerodoc.model.SaleAgent;
import org.jboss.aerogear.aerodoc.model.entity.SalesAgentEntity;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.persistence.UsingDataSet;
import org.jboss.shrinkwrap.api.Archive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.asset.EmptyAsset;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

import static junit.framework.Assert.assertEquals;
import static junit.framework.Assert.assertNotNull;

/**
 * @author edewit@redhat.com
 */
@RunWith(Arquillian.class)
@UsingDataSet("SalesAgents.yml")
public class SaleAgentEndpointTest {

  @Deployment
  public static Archive<?> createDeployment() {
    return ShrinkWrap.create(WebArchive.class, "test.war")
        .addPackage(SalesAgentEntity.class.getPackage())
        .addClass(AerodocBaseEndpoint.class)
        .addClass(SaleAgentEndpoint.class)
        .addClass(SaleAgent.class)
        .addAsLibraries(
            Maven.resolver()
                .loadPomFromFile("pom.xml").resolve(
                "org.picketlink:picketlink-impl:2.5.2.Final",
                "org.picketlink:picketlink-idm-simple-schema:2.5.2.Final",
                "org.hibernate:hibernate-search"
            ).withTransitivity().asFile()
        )
        .addAsResource("persistence-test.xml", "META-INF/persistence.xml")
        .addAsWebInfResource(EmptyAsset.INSTANCE, "beans.xml");
  }

  @Inject
  private SaleAgentEndpoint saleAgentEndpoint;

  @PersistenceContext
  private EntityManager entityManager;

  @Before
  public void setupGeoSpatialSearchIndex() throws InterruptedException {
    FullTextEntityManager fullText = Search.getFullTextEntityManager(entityManager);
    final List<SalesAgentEntity> entities = entityManager.createQuery("from SalesAgentEntity",
        SalesAgentEntity.class).getResultList();

    for (SalesAgentEntity entity : entities) {
      System.out.println("entity = " + entity.getId());
      fullText.index(entity);
    }

    fullText.createIndexer().startAndWait();
  }

  @Test
  public void shouldFindSalesAgentInGeoRegion() {
    final List<SaleAgent> saleAgents = saleAgentEndpoint.listByCriteria(52.1193662,	5.4048443, 1D);

    assertNotNull(saleAgents);
    assertEquals(3, saleAgents.size());
  }
}
