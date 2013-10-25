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
package org.jboss.aerogear.aerodoc.model;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.picketlink.idm.model.annotation.AttributeProperty;
import org.picketlink.idm.model.basic.Agent;

import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement
@JsonIgnoreProperties({"attributes","partition"})
public class SaleAgent extends Agent implements Serializable {

    @AttributeProperty
    private String status;

    private String password;

    @AttributeProperty
    private String location;

    @AttributeProperty
    private Double latitude;

    private Double longitude;

    public String getStatus() {
        return this.status;
    }

    public void setStatus(final String status) {
        this.status = status;
    }

    public String getLocation() {
        return this.location;
    }

    public void setLocation(final String location) {
        this.location = location;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        String result = getClass().getSimpleName() + " ";
        if (status != null && !status.trim().isEmpty())
            result += "status: " + status;
        if (location != null && !location.trim().isEmpty())
            result += ", location: " + location;
        return result;
    }
}