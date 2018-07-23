
# BillManager

the main goal of this application it's to create and personalize bills based on a SCRUM project management application.

  

  

## Installation

  

1. First you have to install the back-end wich is based on a web API using C#, .NET web API and SQL server.

- Take the sql script named ''database.sql'' and run it in sql server

- Then you can reference the back in IIS

![](http://www.helpmasterpro.com/helpfile/Web%20Modules/images/IIS7_addapplication1.png)

  

- After that go to web.config file and change the connection string to yours ( you can get it on sql server )

![](https://docs.telerik.com/devtools/aspnet-ajax/controls/panelbar/getting-started/images/panelbar_connection_string.png)

Then you can run the back to overwrite the previous version with the old connection string

  

2. Install the front using npm

- Go to ``webIHM\billManagerApp\`` and run `` npm install``

  

3. Change the url for contacting the API to yours in thoses files : 
- ``file-generator.component.ts``  
- ``devis-requester.module.ts``
- `` transmuter.module.ts ``
- ``constante-calcul.component.ts``
- ``employees.component.ts``

4.  build the front
- To build the front go in ``webIHM\billManagerApp\``and run  ``ng build --prod``
- The built version will be in ``webIHM\billManagerApp\dist\billManagerApp``
- Then reference the built version in IIS

5. Usage 

![](vuApp.png)

- start by adding your ressources, tarifications and calcul parameters on the settings page 
- then you can start making bills on the apps page


6. Upcoming in the next versions ? 

- posibility to change the pivotal tracker api token ? 
- posibility to change the API the project management app ?
- interface to change the conection string ? 
- mobil version ? 
- dashboard ? 