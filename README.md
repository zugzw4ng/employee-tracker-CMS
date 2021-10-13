# Employee Tracker

------

## Description
------

A simple command line application that allows the user to manage a company's employee information. 


## Table of Contents 
------

* [Installation](#installation)

* [About](#about)

* [Demo](#demo)


## Installation

To install necessary dependencies, copy the package.json file and run the following command: 

npm install

Next, copy the /db/ folder and run the schema.sql and seeds.sql files through MySQL, and replace the "password:" on index.js with your SQL password to connect the database.

Lastly, switch to your integrated terminal and run the application with the following command:

node index.js

------


## About

This program is designed for the user to be able to interact with a company's employee database through the command-line. The user can view, edit, and update the database, and the information is provided in tables on the command-line for better readability. The application is powered by Node.js, utilizing the Inquirer, Express, MySQL2, and 
console.table packages. 
