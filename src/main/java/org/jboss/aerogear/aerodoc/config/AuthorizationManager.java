/*
 * JBoss, Home of Professional Open Source
 * Copyright 2014, Red Hat, Inc. and/or its affiliates, and individual
 * contributors by the @authors tag. See the copyright.txt in the
 * distribution for a full listing of individual contributors.
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
package org.jboss.aerogear.aerodoc.config;

import org.apache.deltaspike.security.api.authorization.Secures;
import org.picketlink.Identity;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

/**
 * <p>This class centralizes all authorization services for this application.</p>
 *
 * @author Pedro Igor
 *
 */
@ApplicationScoped
public class AuthorizationManager {

    @Inject
    private Instance<Identity> identityInstance;

    /**
     * <p>Authorization check for {@link RequiresAccount} annotation.</p>
     *
     * @return true if the user is logged in
     */
    @Secures
    @RequiresAccount
    public boolean isLoggedIn() {
        return getIdentity().isLoggedIn();
    }

    private Identity getIdentity() {
        return this.identityInstance.get();
    }
}