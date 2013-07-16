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

package org.jboss.aerogear.aerodoc.config;

import org.jboss.aerogear.controller.router.decorators.cors.CorsConfig;
import org.jboss.aerogear.controller.router.decorators.cors.CorsConfiguration;

import javax.enterprise.inject.Produces;

/**
 * CorsConfigProducer is the CDI way of configuring CORS in AeroGear Controller.
 */
public class CorsConfigProducer {

    /**
     * Produces a {@link org.jboss.aerogear.controller.router.decorators.cors.CorsConfiguration} instance which will be used to configure the
     * CORS support.
     *
     * @return {@link org.jboss.aerogear.controller.router.decorators.cors.CorsConfiguration} with the CORS settings desired.
     */
    @Produces
    public CorsConfiguration demoConfig() {
        return CorsConfig.enableCorsSupport()
                .anyOrigin()
                .enableCookies()
                .maxAge(20)
                .enableAllRequestMethods()
                .validRequestHeaders("accept, content-type");
    }

}