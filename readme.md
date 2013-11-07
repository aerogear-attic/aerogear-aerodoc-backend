# aerogear-aerodoc-backend  [![Build Status](https://travis-ci.org/aerogear/aerogear-aerodoc-backend.png)](https://travis-ci.org/aerogear/aerogear-aerodoc-backend)

This backend application is a showcase / quickstart part of Aerogear's UnifiedPush facilities.
This Application shows how a business specific App can interact with [aerogear-unifiedpush-server](https://github.com/aerogear/aerogear-unifiedpush-server) . It shows how it can use the  [aerogear-unifiedpush-java-client](https://github.com/aerogear/aerogear-unifiedpush-java-client) to send Unified Messages to the push server.

# Description of the Application

AeroDoc is a company in the health care industry, selling a revolutionary tensiometer. Their clients are doctors. AeroDoc has several sales agents all over the United States. At the headquarters, they have their "first line" sales departement, doing cold calls all along the day. As soon they have a concrete lead, they use their AeroDoc Admin app to filter out available sales Agents available in the lead area. They can then send them a push notification.

The sales agent receives the notification on their mobile device that a new lead is available. The agent will handle the lead by "accepting" the notifcation, informing the other agents that the lead has been processed.

In this highly competitive market of the tensiometers, be able to process a lead directly is for sure a competitve advantage.

## The client app

1. The client consist of a list of leads : a lead can be "open" or "in process", leads "in process" of other sales are not visible.

* optional : when the client tap a lead it appears on  a map

2. The client has a status that he can set: STANDBY | WITH_CLIENT |PTO 
3. The client has a location
4. The client has an alias

## AeroDoc Admin client

1. The admin client can create a new lead :

* A lead consist of a name and a location

2. The admin client can query for Sales Agents based on :

* Status
* Location

3. The admin client can assign a lead to a selection (1..n) of sales agents, this will send out the nofitications.

4. The admin client manage the Sales Agents DB.

## General flow 

1. Your are a Sale Agent (SA) and you log yourself

2. First screen displayed a list of all unassigned leads retrieved server side (Rest service by default send only unassigned leads)

3. An admin pushes a new lead to a chosen list of SA (including you)

4. You receive the push notification, alert is displayed

5. Your device refresh the list of unassigned leads (server side call). Potentially retrieving also unassigned leads not directly pushed to you. Nice to have feature: The one pushed to you should be highlighted.

6. You accept the lead. The lead is removed from unassigned list and go in Second tab: your accepted list which is stored locally on you device.

7. On acceptation of your lead, you send an update to server. Server side broadcast to all SA (except yourself) to refresh unassigned leads list.

# Installation

## Prerequisites

## aerogear-unifiedpush-server

Be sure to have a running instance of a Push Server. Intructions can be found [here](https://github.com/aerogear/aerogear-unifiedpush-server).

## Clients

* [aerogear-aerodoc-ios](https://github.com/aerogear/aerogear-aerodoc-ios)
* [aerogear-aerodoc-android](https://github.com/aerogear/aerogear-aerodoc-android	)
* [aerogear-aerodoc-web](https://github.com/aerogear/aerogear-aerodoc-web)


### Available aliases
When registring the device on the Push Server make sure to use one of the existing aliases (or you should create a new user on the AeroDoc Admin Page) :

* john
* jake
* maria
* bob

For all these aliases the password is ``` 123 ```

# Deploying the app

``` mvn clean install jboss-as:deploy ```

There is also a lucene index created with the location of sales agents default location is '.' you can change to a more permanent location in the persistence.xml

# AeroDoc Admin Application

Browse to ``` localhost:8080/aerodoc ```

You should log in with john/123 , he has admin rights and create leads and send notification.

## Configure the Push Server Details

On the left menu you should have a link to ```Push Configuration``` .
From there you can create and manage your push configs. You should have at least 1 config available.

You can have more than one config but only one can be active. This can be useful when you have to switch between localhost and an OpenShift hosted Push Server for instance. Switching from one config to another can be done at runtime and no restart is needed. Just select the config you want and make sure it has ```active``` enabled. 


## Creating a lead

Use the form to create a new Lead

## Send a lead to Sale Agents

* Select a lead from the lead's list
* If needed enter the 2 available criterias ``` status ``` and/or ``` location ``` (you can also search without criteria).
* Select the agents you want to send the lead to.
* Push the button ``` Send Lead ```

# AeroDoc API

The native clients can access the following REST based services :

## ``` POST /rest/login ``` 

Login service, mandatory for all further request.

``` 
curl -v -b cookies.txt -c cookies.txt -H "Accept: application/json" -H "Content-type: application/json"
-X POST -d '{"loginName": "john", "password":"123"}' http://localhost:8080/aerodoc/rest/login 
```

It will return the user :

```
 {"id":"cb3c05aa-3fdd-4b4e-9b90-386fc7e5671a","enabled":true,"createdDate":1371215851063,"expirationDate":null,"partition":null,"loginName":"john","firstName":null,"lastName":null,"email":null,"status":"PTO","password":"123","location":"New York"}
```

## ``` POST /rest/logout ``` 

Logout service.

``` 
curl -v -b cookies.txt -c cookies.txt -H "Accept: application/json" -H "Content-type: application/json"
-X POST -d '{"loginName": "john", "password":"123"}' http://localhost:8080/aerodoc/rest/logout 
```

returns no data

## ``` GET  /rest/leads ```

Obtain a list of leads.

```
 curl -v -b cookies.txt -c cookies.txt -H "Accept: application/json" -H "Content-type: application/json" 
-X GET http://localhost:8080/aerodoc/rest/leads 
```

You will get a list of leads **which has not a saleAgent set yet** :

```
[{"id":39,"version":0,"name":"Doctor No","location":"New York","phoneNumber":"0612412121"}]
```

## ``` PUT /rest/saleagents/{id} ```

Update a SaleAgent, the service will only update the status and the location for now.

```
 curl -v -b cookies.txt -c cookies.txt -H "Accept: application/json" -H "Content-type: application/json" -X PUT -d '{"id":"13bbaea3-9271-43f7-80aa-fb21360ff684","enabled":true,"createdDate":1371213256827,"expirationDate":null,"partition":null,"loginName":"john","firstName":null,"lastName":null,"email":null,"version":0,"status":"CHANGED","password":"123","location":"New York"}' http://localhost:8080/aerodoc/rest/saleagents/13bbaea3-9271-43f7-80aa-fb21360ff684
```

returns no data

## ``` PUT /rest/leads/{id} ```

Update a Lead, typically used if a Sale Agent wants to assign a lead to him.

```
curl -v -b cookies.txt -c cookies.txt -H "Accept: application/json" -H "Content-type: application/json" -X PUT -d '{"id":39,"version":0,"name":"Doctor No","location":"New York","phoneNumber":"121212121","saleAgent":"13bbaea3-9271-43f7-80aa-fb21360ff684"}' http://localhost:8080/aerodoc/rest/leads/39
```

returns no data
