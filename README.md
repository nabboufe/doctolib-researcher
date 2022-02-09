# Doctolib Researcher

This website allows you to search for profiles on Doctolib based on some keywords. 
I created an API using puppeteer to scrap the data, which is then stored in a SQL database that I interact with Sequelize.
The server works with Express, it is possible to create users and save past searches, passwords are protected with bcrypt.
The frontend is managed with React, sliced by Components.
The user management is done with http only cookies and Private Routes. 

# How to test the website

You need to have create-react-app, and run 'npm start' in your console,
then go to src/server/app/ then run node server.js
You can now access it in http://localhost:3000/
