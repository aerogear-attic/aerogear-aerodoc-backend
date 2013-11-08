/*
 * JBoss, Home of Professional Open Source
 * Copyright Red Hat, Inc., and individual contributors.
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
"use strict";

aerodoc.factory("notifierService", function() {
  var leadEndpoint, leadRequest, broadcastRequest, broadcastEndpoint,
      UPClient = AeroGear.UnifiedPushClient(aeroConfig.variantID, aeroConfig.variantSecret, aeroConfig.pushServerURL+ "/rest/registry/device");

  return {
    connector : function(){
    broadcastRequest = navigator.push.register();
    broadcastRequest.onsuccess = function (event) {
      broadcastEndpoint = event.target.result;

      // first registration?
      if ( broadcastEndpoint.pushEndpoint ) {
        var broadCastSettings = {
          metadata: {
        	  deviceToken: broadcastEndpoint.channelID,
              simplePushEndpoint: broadcastEndpoint.pushEndpoint  
          }          
        }

        UPClient.registerWithPushServer(broadCastSettings);
        console.log("Subscribed to Broadcast messages on " + broadcastEndpoint.channelID);
        console.log(localStorage.getItem(broadcastEndpoint.channelID) || 1);
      } else {
        console.log("Already registered");
      }
    };

    leadRequest = navigator.push.register();
    leadRequest.onsuccess = function (event) {
      leadEndpoint = event.target.result;

      // first registration?
      if ( broadcastEndpoint.pushEndpoint ) {
        var leadSettings = {
          metadata: {
        	  deviceToken: leadEndpoint.channelID,
              alias: sessionStorage.getItem("username"),
              categories: ["lead"],
              simplePushEndpoint: broadcastEndpoint.pushEndpoint  
          }
        }

        UPClient.registerWithPushServer(leadSettings);
        console.log("Subscribed to lead messages on " + leadEndpoint.channelID);
        console.log(localStorage.getItem(leadEndpoint.channelID) || 1);
      } else {
        console.log("Already registered");
      }
     };
    }
  };
});