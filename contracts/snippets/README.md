For example, we have a company that sells electronics.
We have orders from many countries around the world.
And we want to get USD for our orders with little commission instantly.

We already have a web-site with nice GUI.
We already have a database to store info of orders.

- Customer come to our web-site and make order
- Our web-site prepare Ethereum transaction and offer customer to submit it
- Customer submit transaction
- Smart contract accept payment and fire the event with ID of paid order

- Simple script on our server polls Ethereum blockchain every 10min for the new events.
- Received event means that order is payed.
- Script marks order in the database as paid.
- We start to prepare goods for the shipping...

30 lines of code in Solidity and 300 lines of code on our web-site - and we have a new payment gateway for the USD.
Not for BTC, ETH etc. - for USD !!!
And we have the ability to reduce this amount to just 10 lines of code.
This is the true power of Jibrel
