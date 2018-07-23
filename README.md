# BillManager
the main goal of this application it's to create and personalize bills based on a SCRUM project management application.

  

## Installation

 1. First you have to install the back-end wich is based on a web API using C#, .NET web API and SQL server.
-  Take the sql script named ''database.sql'' and run it in sql server
-  Then you can reference the back in IIS 	
![](http://www.helpmasterpro.com/helpfile/Web%20Modules/images/IIS7_addapplication1.png) 

- After that go to web.config file and change the connection string to yours ( you can get it on sql server ) 
![](https://docs.telerik.com/devtools/aspnet-ajax/controls/panelbar/getting-started/images/panelbar_connection_string.png)
Then you can run the back to overwrite the previous version with the old connection string

2.  Install the front using npm 
- go to  webIHM\billManagerApp\ and run npm install