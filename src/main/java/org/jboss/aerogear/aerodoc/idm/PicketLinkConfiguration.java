package org.jboss.aerogear.aerodoc.idm;

import org.jboss.aerogear.aerodoc.idm.credential.UserPasswordCredentialHandler;
import org.jboss.aerogear.aerodoc.model.entity.AccountTypeEntity;
import org.jboss.aerogear.aerodoc.model.entity.AttributeTypeEntity;
import org.jboss.aerogear.aerodoc.model.entity.DigestCredentialTypeEntity;
import org.jboss.aerogear.aerodoc.model.entity.GroupTypeEntity;
import org.jboss.aerogear.aerodoc.model.entity.IdentityTypeEntity;
import org.jboss.aerogear.aerodoc.model.entity.OTPCredentialTypeEntity;
import org.jboss.aerogear.aerodoc.model.entity.PartitionTypeEntity;
import org.jboss.aerogear.aerodoc.model.entity.PasswordCredentialTypeEntity;
import org.jboss.aerogear.aerodoc.model.entity.RelationshipIdentityTypeEntity;
import org.jboss.aerogear.aerodoc.model.entity.RelationshipTypeEntity;
import org.jboss.aerogear.aerodoc.model.entity.RoleTypeEntity;
import org.jboss.aerogear.aerodoc.model.entity.SalesAgentEntity;
import org.jboss.aerogear.aerodoc.model.entity.X509CredentialTypeEntity;
import org.picketlink.IdentityConfigurationEvent;
import org.picketlink.annotations.PicketLink;
import org.picketlink.idm.config.IdentityConfigurationBuilder;
import org.picketlink.internal.EEJPAContextInitializer;

import javax.enterprise.event.Observes;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

public class PicketLinkConfiguration {

    @SuppressWarnings("unused")
    @PicketLink
    @PersistenceContext(unitName = "picketlink-default")
    @Produces
    private EntityManager picketLinkEntityManager;

    @Inject
    private EEJPAContextInitializer contextInitializer;

    public void configure(@Observes IdentityConfigurationEvent event) {
        IdentityConfigurationBuilder builder = event.getConfig();

        builder
            .named("default")
                .stores()
                    .jpa()
                        .mappedEntity(
                                PartitionTypeEntity.class,
                                RoleTypeEntity.class,
                                GroupTypeEntity.class,
                                IdentityTypeEntity.class,
                                SalesAgentEntity.class,
                                RelationshipTypeEntity.class,
                                RelationshipIdentityTypeEntity.class,
                                PasswordCredentialTypeEntity.class,
                                DigestCredentialTypeEntity.class,
                                X509CredentialTypeEntity.class,
                                OTPCredentialTypeEntity.class,
                                AttributeTypeEntity.class,
                                AccountTypeEntity.class
                        )
                        .addContextInitializer(this.contextInitializer)
                        .addCredentialHandler(UserPasswordCredentialHandler.class)
                        .supportAllFeatures();
    }

}
