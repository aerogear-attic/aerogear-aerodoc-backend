package org.jboss.aerogear.aerodoc.model;

import java.io.Serializable;
import java.lang.String;
import javax.persistence.*;

/**
 * Entity implementation class for Entity: PushConfig
 * 
 */
@Entity
public class PushConfig implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id = null;
    @Version
    @Column(name = "version")
    private int version = 0;

    @Column
    private String pushApplicationId;
    
    @Column
    private String masterSecret;

    @Column
    private String serverURL;
    
    @Column
    private boolean active;
    
    private static final long serialVersionUID = 1L;

    public PushConfig() {
        super();
    }

    public String getPushApplicationId() {
        return this.pushApplicationId;
    }

    public void setPushApplicationId(String pushApplicationId) {
        this.pushApplicationId = pushApplicationId;
    }

    public String getServerURL() {
        return this.serverURL;
    }

    public void setServerURL(String serverURL) {
        this.serverURL = serverURL;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

	public String getMasterSecret() {
		return masterSecret;
	}

	public void setMasterSecret(String masterSecret) {
		this.masterSecret = masterSecret;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}
    
    

}
