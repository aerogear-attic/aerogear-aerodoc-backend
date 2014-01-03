package org.jboss.aerogear.aerodoc.rest;

import org.jboss.aerogear.aerodoc.RestApplication;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.Path;
import java.net.URL;

import static com.jayway.restassured.RestAssured.delete;
import static com.jayway.restassured.RestAssured.get;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItems;

/**
 * @author edewit@redhat.com
 */
@RunWith(Arquillian.class)
@RunAsClient
public class SaleAgentRestTest {
  private static final String RESOURCE_PREFIX = RestApplication.class.getAnnotation(ApplicationPath.class).value().substring(1) +
      SaleAgentEndpoint.class.getAnnotation(Path.class).value();

  @Deployment(testable = false)
  public static WebArchive createDeployment() {
    return SaleAgentEndpointTest.createDeployment()
        .addClass(RestApplication.class)
        .addAsResource("import.sql");
  }

  @ArquillianResource
  private URL deploymentUrl;

  @Test
  public void shouldFindSalesAgentById() {
    get(getResourceUrl() + "/03d148fb-051b-4b2a-9291-a2badc5030f4").then().body("loginName", equalTo("john"));
  }

  @Test
  public void shouldReturn404WhenNotFound() {
    get(getResourceUrl() + "/1").then().statusCode(404);
  }

  @Test
  public void shouldDeleteAgents() {
    final String resource = getResourceUrl() + "/7b6cc3c9-205b-4fa4-840f-11e44fed20f4";
    get(resource).then().statusCode(200);
    delete(resource);
    get(resource).then().statusCode(404);
  }

  @Test
  public void shouldListAllAgents() {
    get(getResourceUrl()).then().body("id", hasItems("e5a3b8c4-ede6-4fe4-be2c-41392f2d31d1",
        "727c534a-9e4c-4d62-a46b-337f5b6c3e5e", "03d148fb-051b-4b2a-9291-a2badc5030f4"));
  }

  private String getResourceUrl() {
    return deploymentUrl.toString() + RESOURCE_PREFIX;
  }
}
