/*
 * JBoss, Home of Professional Open Source
 * Copyright 2012, Red Hat, Inc., and individual contributors
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

package org.aerogear.prodoctor.config;

import java.util.Map.Entry;
import java.util.Set;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;

import org.aerogear.prodoctor.rest.ResponseHeaders;
import org.jboss.aerogear.controller.router.MediaType;
import org.jboss.aerogear.controller.router.RouteContext;
import org.jboss.aerogear.controller.router.rest.JsonResponder;

@ApplicationScoped
public class CustomMediaTypeResponder extends JsonResponder
{

   public static final MediaType CUSTOM_MEDIA_TYPE = new MediaType(MediaType.JSON.getType(), CustomMediaTypeResponder.class);
   private ResponseHeaders responseHeaders;

   @Override
   public MediaType getMediaType()
   {
      return CUSTOM_MEDIA_TYPE;
   }

   public void loggedInHeaders(@Observes ResponseHeaders headers)
   {
      responseHeaders = headers;
   }

   @Override
   public void writeResponse(Object entity, RouteContext routeContext) throws Exception
   {
      if (responseHeaders != null && responseHeaders.getHeaders() != null)
      {
         Set<Entry<String, String>> entrySet = responseHeaders.getHeaders().entrySet();
         for (Entry<String, String> entry : entrySet)
         {
            routeContext.getResponse().setHeader(entry.getKey(), entry.getValue());
         }
      }
      super.writeResponse(entity, routeContext);
   }

}