package org.jboss.aerogear.aerodoc.model.entity;

import org.jboss.aerogear.aerodoc.model.SaleAgent;
import org.picketlink.idm.jpa.annotations.entity.IdentityManaged;

import javax.persistence.Entity;

/**
 * Created with IntelliJ IDEA. User: pedroigor Date: 8/26/13 Time: 10:13 AM To change this template use File | Settings
 * | File Templates.
 */
@IdentityManaged (SaleAgent.class)
@Entity
public class SalesAgentEntity extends AccountTypeEntity {

    private String status;
    private String location;

    public String getStatus() {
        return status;
    }

    public void setStatus(final String status) {
        this.status = status;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(final String location) {
        this.location = location;
    }
}
