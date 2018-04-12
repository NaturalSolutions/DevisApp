using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace WebApplication4
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Configuration et services API Web

            // Itinéraires de l'API Web
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "tarificationApi",
                routeTemplate: "api/{controller}/{id}/{action}",
                defaults: new { id = RouteParameter.Optional }
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


            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new System.Net.Http.Headers.MediaTypeHeaderValue("text/html"));
            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        }
    }
}
