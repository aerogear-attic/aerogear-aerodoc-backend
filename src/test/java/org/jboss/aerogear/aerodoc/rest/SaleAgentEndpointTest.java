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
import javax.transaction.UserTransaction;
import java.util.List;

import static junit.framework.Assert.assertEquals;
import static junit.framework.Assert.assertNotNull;

/**
 * @author edewit@redhat.com
 */
@RunWith(Arquillian.class)
public class SaleAgentEndpointTest {

  @Deployment
  public static Archive<?> createDeployment() {
    return ShrinkWrap.create(WebArchive.class, "test.war")
        .addPackage(SalesAgentEntity.class.getPackage())
//        .addClass(AerodocBaseEndpoint.class)
//        .addClass(SaleAgentEndpoint.class)
        .addClass(SaleAgent.class)
        .addAsLibraries(
            Maven.resolver()
                .loadPomFromFile("pom.xml").resolve(
                "org.picketlink:picketlink-impl:2.5.2.Final",
                "org.picketlink:picketlink-idm-simple-schema:2.5.2.Final"//,
//                "org.hibernate:hibernate-search"
            ).withTransitivity().asFile()
        )
        .addAsResource("persistence-test.xml", "META-INF/persistence.xml")
        .addAsWebInfResource(EmptyAsset.INSTANCE, "beans.xml");
  }

//  @Inject
//  private SaleAgentEndpoint saleAgentEndpoint;

  @PersistenceContext
  private EntityManager entityManager;

//  @Inject
//  UserTransaction utx;
//
//  @Before
//  public void insertData() throws Exception {
//    utx.begin();
//    entityManager.joinTransaction();
//    System.out.println("Inserting records...");
//    SalesAgentEntity salesAgentEntity = new SalesAgentEntity();
//    salesAgentEntity.setId("1");
//    salesAgentEntity.setLongitude(12.5);
//    salesAgentEntity.setLatitude(11.5);
//    entityManager.persist(salesAgentEntity);
//    utx.commit();
//    // clear the persistence context (first-level cache)
//    entityManager.clear();
//  }


  @Test
  @UsingDataSet("SalesAgents.yml")
  public void shouldFindSalesAgentInGeoRegion() {
//    FullTextEntityManager fullText = Search.getFullTextEntityManager(entityManager);
    final List<SalesAgentEntity> entities = entityManager.createQuery("select u from SalesAgentEntity u", SalesAgentEntity.class).getResultList();
    for (SalesAgentEntity entity : entities) {
      System.out.println("entity = " + entity.getId());
//      fullText.index(entity);
    }

//    final List<SaleAgent> saleAgents = saleAgentEndpoint.listByCriteria(52.1193662,	5.4048443, 1D);

//    assertNotNull(saleAgents);
//    assertEquals(3, saleAgents.size());
  }
}
