/*
 * JBoss, Home of Professional Open Source
 *
 * Copyright 2013 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.jboss.aerogear.aerodoc.idm.credential;

import org.jboss.aerogear.aerodoc.model.SaleAgent;
import org.picketlink.idm.IdentityManager;
import org.picketlink.idm.credential.UsernamePasswordCredentials;
import org.picketlink.idm.credential.handler.PasswordCredentialHandler;
import org.picketlink.idm.model.Account;
import org.picketlink.idm.model.basic.Agent;
import org.picketlink.idm.model.basic.User;
import org.picketlink.idm.query.IdentityQuery;
import org.picketlink.idm.spi.IdentityContext;

import java.util.Collections;
import java.util.List;

/**
 * <p>Custom {@link PasswordCredentialHandler} that knows how to handle {@link SaleAgent} types.</p>
 *
 * @author pedroigor
 */
public class UserPasswordCredentialHandler extends PasswordCredentialHandler {

    @Override
    protected Account getAccount(final IdentityContext context, final UsernamePasswordCredentials credentials) {
        List<? extends Account> result = findByLoginName(context, SaleAgent.class, credentials.getUsername());

        if (result.isEmpty()) {
            return super.getAccount(context, credentials);
        }

        return result.get(0);
    }

    private <A extends Agent> List<A> findByLoginName(IdentityContext context, Class<A> type, String loginName) {
        IdentityManager identityManager = getIdentityManager(context);
        IdentityQuery<A> query = identityManager.createIdentityQuery(type);

        query.setParameter(Agent.LOGIN_NAME, loginName);

        List<A> result = query.getResultList();

        if (result.isEmpty()) {
            return Collections.emptyList();
        }

        return result;
    }

}
