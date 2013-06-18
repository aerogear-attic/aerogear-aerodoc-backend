package org.aerogear.prodoctor.config;

import org.jboss.aerogear.controller.router.MediaType;
import org.jboss.aerogear.controller.router.rest.JsonConsumer;

public class CustomConsumer extends JsonConsumer {
	
	 @Override
	    public String mediaType() {
	        return "application/json; charset=utf-8";
	    }

}
