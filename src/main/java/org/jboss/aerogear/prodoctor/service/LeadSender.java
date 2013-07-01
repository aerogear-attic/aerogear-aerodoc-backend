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

package org.jboss.aerogear.prodoctor.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jboss.aerogear.unifiedpush.DefaultJavaSender;
import org.jboss.aerogear.unifiedpush.resteasy.RestEasyClient;
import org.jboss.aerogear.prodoctor.model.Lead;

public class LeadSender {

	private String serverURL = "http://localhost:8080/ag-push";

	private String pushApplicationId = "317cce6d-efaf-4ff8-94e3-a45c0a3a688c";
	
	//TODO we don't this
	private int leadVersion = 1;
	private int broadcastVersion = 1;

	private DefaultJavaSender defaultJavaSender = new DefaultJavaSender(
			serverURL, new RestEasyClient());

	public void sendLeads(List<String> users, Lead lead) {

		Map categories = new HashMap();
		categories.put("lead", "version="+leadVersion++); ////TODO manage the id
		Map json = new HashMap();
		json.put("id", lead.getId());
		json.put("messageType", "pushed_lead");
		json.put("name", lead.getName());
		json.put("location", lead.getLocation());
		json.put("phone", lead.getPhoneNumber());
		json.put("simple-push", categories);
		json.put("sound" ,"default");
		json.put("alert" ,"A new lead has been created");

		defaultJavaSender.sendTo(users, json, pushApplicationId);
	}

	public void sendBroadCast(Lead lead) {
		Map categories = new HashMap();
		categories.put("broadcast", "version="+broadcastVersion++); //TODO manage the id
		Map json = new HashMap();
		json.put("id", lead.getId());
		json.put("messageType", "accepted_lead");
		json.put("name", lead.getName());
		json.put("location", lead.getLocation());
		json.put("phone", lead.getPhoneNumber());
		json.put("simple-push", categories);
		json.put("alert" ,"A new lead has been accepted");
		json.put("sound" ,"default");
		defaultJavaSender.broadcast(json, pushApplicationId);
	}

	public String getServerURL() {
		return serverURL;
	}

	public void setServerURL(String serverURL) {
		this.serverURL = serverURL;
	}

	public DefaultJavaSender getDefaultJavaSender() {
		return defaultJavaSender;
	}

	public void setDefaultJavaSender(DefaultJavaSender defaultJavaSender) {
		this.defaultJavaSender = defaultJavaSender;
	}

}
