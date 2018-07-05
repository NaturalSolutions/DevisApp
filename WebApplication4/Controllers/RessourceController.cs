using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication4.Models;
using System.Web.Http.Cors;

namespace WebApplication4.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class RessourceController : ApiController
    {
        private DevisFacturationEntities db;
        public RessourceController()
        {
            this.db = new DevisFacturationEntities();
        }

        // GET: api/Ressource
        public IEnumerable<Ressource> Get() // renvoie Toute les ressource existantes
        {
            try
            {
                List<Ressource> rs = db.Ressource.ToList();
                if ((rs.Count > 0 ) && (rs != null)) // verification de la nullité de la liste renvoyé
                {
                    return rs; // si c'est bon on renvoi la liste des taches json ou xml dailleurs mais mieux JSON quand meme c'est moins caca
                }
                else
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Aucun élément dans la liste"));
                }
            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message));
            }
        }

        // GET: api/Ressource/5
        public Ressource Get(int id)// renvoie la ressource de par son ID
        {
            Ressource res = this.db.Ressource.Where(s => s.ID == id).FirstOrDefault();   // renvoi l'objet pointé par l'id pris en paramètre      
            if (res != null)
            {
                return res;
            }
            else
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "pas d'objet pour cet ID"));
            }
        }


        //[HttpGet]
        //[ActionName("tarification")]
        //[Route("Ressource/{id}/Tarification")]
        //public List<Tarification> GetTarification(int id)
        //{      
        //    List<Tarification> tar = db.Tarification_Ressource.Include("Tarification").Where(s => s.FK_Ressource == id).Select(s => s.Tarification).ToList();
        //    if (tar != null)
        //    {
        //        return tar;
        //    }
        //    else
        //    {
        //        throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "pas d'objet pour cet ID"));
        //    }
        //}

        public struct ressClient
        {
            public string initial;
            public string mail;
            public string name;
            public int niveau;
            public List<String> tarification;
        }

        // POST: api/Ressource
        public void Post(ressClient rss) // Ajout d'une nouvelle ressource 
        {
            Ressource newRess = new Ressource();
            newRess.Initial = rss.initial;
            newRess.Mail = rss.mail;
            newRess.Name = rss.name;
            newRess.Niveau = rss.niveau;
            newRess.Obsolete = false;
            newRess.Date = DateTime.Now;
            Tarification_Ressource tarRes = new Tarification_Ressource();
            foreach (string nomTar in rss.tarification)
            {
                tarRes.FK_Ressource = newRess.ID;
                Tarification tar = db.Tarification.Where(res => res.Type == nomTar).FirstOrDefault();
                tarRes.FK_Tarification = tar.ID;
            }
            db.Ressource.Add(newRess);
            db.Tarification_Ressource.Add(tarRes);
            db.SaveChanges();
        }

        // PUT: api/Ressource/5
        public void Put(int id, [FromBody]Ressource rss)// Update une ressource Existente de par son ID
        {
            try
            {
                if (rss != null) // si l'objet source n'est pas null => update de la base
                {
                    Ressource rs = db.Ressource.Where(res => res.ID == id).FirstOrDefault(); // recuperer la tache pointé par l'id pris en paramètre de la fonction
                    db.Ressource.Attach(rs); // Faire ecouter le contexte de base de donnée sur les changements de l'objet ts 
                    rs.Name = rss.Name; // changement des différents attribut de l'objet pointé avec les attributs de l'objet pris en paramètre
                    rs.Mail = rss.Mail; // same
                    rs.Initial = rss.Initial; // same
                    rs.Niveau = rss.Niveau; // same
                    rs.Date = rss.Date; // same
                    rs.Obsolete = rss.Obsolete; // same
                    db.SaveChanges(); // mise a jour de la table
                }
                else // sinon je throw une exception
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "l'objet source est vide"));
                }

            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e.Message));
            }

        }

        // DELETE: api/Ressource/5
        public void Delete(int id) // detruit la ressource de par son ID
        {
            try // vérrif si un objet a été trouvé pour l'id
            {
                Ressource ts = db.Ressource.Where(res => res.ID == id).FirstOrDefault(); // récupération de la tache pointé par l'id
                db.Ressource.Attach(ts); // ecouter les changement de l'objet 
                db.Ressource.Remove(ts); // remove l'objet ts
                db.SaveChanges(); // mettre a jour la table
            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Pas d'objet pour cet Id"));
            }
        }
    }
}
