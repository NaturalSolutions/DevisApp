using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;


namespace WebApplication4
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {//Crossdomainorginin access
            EnableCrossSiteRequests(config);
            // Configuration et services API Web
            // Itinéraires de l'API Web
            ////var cors = new EnableCorsAttribute("*", "*", "*");
            //config.EnableCors(cors);
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "tarification",
                routeTemplate: "api/tarification/"
            );

            config.Routes.MapHttpRoute(
                name: "FacturationApi",
                routeTemplate: "api/Facturation/{action}",
                defaults: new { controller = "Facturation" }
            );            

            config.Routes.MapHttpRoute(
                name: "WordFileApi",
               routeTemplate: "api/WordFile/{action}",
               defaults: new { controller = "WordFile" }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );


            config.Routes.MapHttpRoute(
               name: "StructureApi",
               routeTemplate: "api/{controller}/getStructure"
           );


            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new System.Net.Http.Headers.MediaTypeHeaderValue("text/html"));
            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        }

        private static void EnableCrossSiteRequests(HttpConfiguration config)
        {
            var cors = new EnableCorsAttribute(
                origins: "*",
                headers: "*",
                methods: "*");
            config.EnableCors(cors);
        }
    }
}
