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
package org.jboss.aerogear.aerodoc.config;

import org.jboss.aerogear.aerodoc.model.SaleAgent;
import org.picketlink.idm.IdentityManager;
import org.picketlink.idm.PartitionManager;
import org.picketlink.idm.RelationshipManager;
import org.picketlink.idm.credential.Password;
import org.picketlink.idm.model.basic.Agent;
import org.picketlink.idm.model.basic.BasicModel;
import org.picketlink.idm.model.basic.Role;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import java.util.List;

@Singleton
@Startup
public class PicketLinkDefaultUsers {

    private static final String DEFAULT_USER = "john";

    @Inject
    private PartitionManager partitionManager;

    private IdentityManager identityManager;
    private RelationshipManager relationshipManager;

    /**
     * <p>
     * Loads some users during the first construction.
     * </p>
     */
    @PostConstruct
    public void create() {
        this.identityManager = partitionManager.createIdentityManager();
        this.relationshipManager = partitionManager.createRelationshipManager();

        SaleAgent adminUser = findByUsername(DEFAULT_USER);
        //TODO hack to see if the idm db has been created or not
        if (adminUser == null) {
        	SaleAgent john = new SaleAgent();
            john.setLocation("New York");
            john.setStatus("PTO");
            john.setLoginName("john");

            SaleAgent bob = new SaleAgent();
            bob.setLocation("New York");
            bob.setStatus("STANDBY");
            bob.setLoginName("bob");

            SaleAgent maria = new SaleAgent();
            maria.setLocation("New York");
            maria.setStatus("STANDBY");
            maria.setLoginName("maria");

            SaleAgent jake = new SaleAgent();
            jake.setLocation("Boston");
            jake.setStatus("STANDBY");
            jake.setLoginName("jake");

			/*
             * Note: Password will be encoded in SHA-512 with SecureRandom-1024
			 * salt See
			 * http://lists.jboss.org/pipermail/security-dev/2013-January
			 * /000650. html for more information
			 */
            this.identityManager.add(john);
            this.identityManager.updateCredential(john, new Password("123"));

            this.identityManager.add(bob);
            this.identityManager.updateCredential(bob, new Password("123"));

            this.identityManager.add(maria);
            this.identityManager.updateCredential(maria, new Password("123"));

            this.identityManager.add(jake);
            this.identityManager.updateCredential(jake, new Password("123"));

            Role admin = new Role("admin");
            this.identityManager.add(admin);

            Role simple = new Role("simple");
            this.identityManager.add(simple);
            grantRoles(john, admin);
            grantRoles(john, simple);

            grantRoles(bob, simple);
            grantRoles(maria, simple);
            grantRoles(jake, simple);
        }
    }

    private SaleAgent findByUsername(String username) {
        List<SaleAgent> list = identityManager.createIdentityQuery(SaleAgent.class)
                .setParameter(SaleAgent.LOGIN_NAME, username).getResultList();
        return list.isEmpty() ? null : list.get(0);
    }

    private void grantRoles(Agent agent, Role role) {
        BasicModel.grantRole(relationshipManager, agent, role);
    }

}