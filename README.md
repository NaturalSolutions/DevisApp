# Natural_solution_API


# ASP dot NET et web API

## What is ASP dot NET Web API  ? 

>ASP dot NET is a framework for building web API's HTTP based services on top of the .NET framework
>These services can be consumed by a big range of clients like 
> 
> + Browsers
> + Mobile application
> + Desktop applications
> + IOTs ( internet of things )

## What are RESTful services ? 

> REST stands for Representation State Transfer. REST is ans architehtural pattern for creating services using HTTP protocol

## REST Constraints

**Clint | Server**

+ this means that the client side and the server side are independent : the client send a request to the server and the server answer to the client 

**Stateless**

+ the server side shouldn't store any information related to the client | The client request should contain all the informations necessary to the server to execute that request | Each request can be trated indenpendently by the server 

**Cacheable**

+ let the client know how long the data he collected is good for so the client does not have to come back to the server over and over for the same information ( increase the performance of the system ) 

**Uniform Interface**

+  this constraint define the interface between the client and the server 
 Explanation :
	 * What is a Ressource ? 
	 in the context of a REST Api the ressources are represente the data
	 exemple : Product, Employee, Customer.....
	 
	 * What are the HTTP verbs GET , PUT , POST , DELETE  ?  
	 those verbs tells the Api what to do with the ressources. Each ressource is identify 
	 by a URI ( Uniform Ressource Identifier )  exemple : 
	 
	 |Resource|Verb|Outcome|
	 |--|--|--|
	 |/Employees |GET|get list of employees|
	 |/Employee/1 |GET|get employee with id = 1|
 	 |/Employees |POST|Create a new Employee|
 	 |/Employees/1 |PUT|Update employee with id = 1|
 	 |/Employee/1 |DELETE|Deletes employee with id = 1 |
	
	---
	
	### Create a new project
	
+ Go to Visual Studio / new Project / Visual C# / ASP . NET Web Application / Select Empty 
or Web API 

? why on a pas fait un projet Web API directement ? 



