/**
 * JBoss, Home of Professional Open Source
 * Copyright Red Hat, Inc., and individual contributors
 * by the @authors tag. See the copyright.txt in the distribution for a
 * full listing of individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.jboss.aerogear.prodoctor.config;

import org.jboss.aerogear.prodoctor.model.SaleAgent;
import org.picketlink.idm.IdentityManager;
import org.picketlink.idm.credential.Password;
import org.picketlink.idm.model.Attribute;
import org.picketlink.idm.model.IdentityType;
import org.picketlink.idm.model.Role;
import org.picketlink.idm.model.SimpleRole;
import org.picketlink.idm.model.SimpleUser;
import org.picketlink.idm.model.User;
import org.picketlink.idm.query.IdentityQuery;
import org.picketlink.idm.query.QueryParameter;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;

@Singleton
@Startup
public class Bootstrap {

	@Inject
	private IdentityManager identityManager;

	/**
	 * <p>
	 * Loads some users during the first construction.
	 * </p>
	 */
	@PostConstruct
	public void create() {

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
		 * Note: Password will be encoded in SHA-512 with SecureRandom-1024 salt
		 * See
		 * http://lists.jboss.org/pipermail/security-dev/2013-January/000650.
		 * html for more information
		 */
		this.identityManager.add(john);
		this.identityManager.updateCredential(john, new Password("123"));

		this.identityManager.add(bob);
		this.identityManager.updateCredential(bob, new Password("123"));
		
		this.identityManager.add(maria);
		this.identityManager.updateCredential(maria, new Password("123"));

		this.identityManager.add(jake);
		this.identityManager.updateCredential(jake, new Password("123"));
		
		Role admin = new SimpleRole("admin");
		this.identityManager.add(admin);

		Role simple = new SimpleRole("simple");
		this.identityManager.add(simple);
		identityManager.grantRole(john, admin);
		identityManager.grantRole(john, simple);

		identityManager.grantRole(bob, simple);
		identityManager.grantRole(maria, simple);
		identityManager.grantRole(jake, simple);
		
		

	}

}