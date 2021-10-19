## General info
A full stack micro service based ticket application.
Core features account creation, listing tickets for sale and purchasing tickets.
* Frontend is built using React and Next.js styled using Boostrap 5. 
* Backend services built using Node and Express, written in Typescript. Data persistence using MongoDB and Redis.
* Event bus implemented using NATS streaming server.
* Deployed in Docker containers running within a Digital Ocean kubernetes cluster.
* Backend services include authentication, orders, tickets, expiration and payments serivces.
* Payment processing implemented using Stripe
* Custom npm package for code reuse across services
## View live

This project is hosted on a digital ocean kubernetes cluster, viewable [here](http://www.conor-microservice-prod.xyz/)
	
## Technologies
Project is created with:
* Next.js
* Typescrpt
* Bootstrap
* Node
* Express
* NATS streaming server
* Postgresql
* Redis
