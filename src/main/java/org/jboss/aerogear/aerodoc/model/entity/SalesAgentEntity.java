package org.jboss.aerogear.aerodoc.model.entity;

import org.jboss.aerogear.aerodoc.model.SaleAgent;
import org.picketlink.idm.jpa.annotations.AttributeValue;
import org.picketlink.idm.jpa.annotations.entity.IdentityManaged;
import org.picketlink.idm.model.annotation.Unique;

import javax.persistence.Entity;

/**
 * Created with IntelliJ IDEA. User: pedroigor Date: 8/26/13 Time: 10:13 AM To change this template use File | Settings
 * | File Templates.
 */
@IdentityManaged (SaleAgent.class)
@Entity
public class SalesAgentEntity extends IdentityTypeEntity {

    @Unique
    @AttributeValue
    private String loginName;

    @AttributeValue
    private String firstName;

    @AttributeValue
    private String lastName;

    @AttributeValue
    private String email;

    @AttributeValue
    private String status;

    @AttributeValue
    private String location;

    public String getLoginName() {
        return this.loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

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
