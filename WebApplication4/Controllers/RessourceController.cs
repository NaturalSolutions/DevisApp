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
                if (rs.Count > 0 ) // verification de la nullité de la liste renvoyé
                {
                    return rs; // si c'est bon on renvoi la liste des taches json ou xml dailleurs mais mieux JSON quand meme c'est moins caca
                }
                else
                {
                    return new List<Ressource>();
                }
            }
            catch (Exception e)
            {
                return new List<Ressource>();
            }
        }

        // GET: api/Ressource/5
        public Ressource Get(int id)// renvoie la ressource de par son ID
        {
            Paramètres para = db.Paramètres.Where(p => p.ID == 1).FirstOrDefault();
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
            public int id;
            public string initial;
            public string mail;
            public string name;
            public int niveau;
            public List<Int16> tarification;
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
            foreach (Int16 idTar in rss.tarification)
            {
                tarRes.FK_Ressource = newRess.ID;
                Tarification tar = db.Tarification.Where(res => res.ID == idTar).FirstOrDefault();
                tarRes.FK_Tarification = tar.ID;
            }
            db.Ressource.Add(newRess);
            db.Tarification_Ressource.Add(tarRes);
            db.SaveChanges();
        }

        // PUT: api/Ressource/5
        public void Put(ressClient majRes)
        {
            Ressource ressource =  db.Ressource.Where(res => res.ID == majRes.id).FirstOrDefault();
            ressource.Initial = majRes.initial;
            ressource.Name = majRes.name;
            ressource.Niveau = majRes.niveau;
            ressource.Mail = majRes.mail;
            ressource.Obsolete = false;
            List<Tarification_Ressource> tarRess = db.Tarification_Ressource.Where(t => t.FK_Ressource == majRes.id).ToList();
            foreach (Tarification_Ressource tar in tarRess)
            {
                db.Tarification_Ressource.Attach(tar);
                db.Tarification_Ressource.Remove(tar);
            }
            db.SaveChanges();
            foreach (Int16 idTar in majRes.tarification)
            {
                Tarification_Ressource tarification_ressource = new Tarification_Ressource();
                tarification_ressource.FK_Ressource = majRes.id;
                Tarification tar = db.Tarification.Where(res => res.ID == idTar).FirstOrDefault();
                tarification_ressource.FK_Tarification = tar.ID;
                db.Tarification_Ressource.Add(tarification_ressource);
            }
            db.SaveChanges();
        }

        // DELETE: api/Ressource/5
        public void Delete(int id)
        {
            Ressource ts = db.Ressource.Where(res => res.ID == id).FirstOrDefault(); // récupération de la tache pointé par l'id
            List<Tarification_Ressource> tarRes = db.Tarification_Ressource.Where(t => t.FK_Ressource == id).ToList();
            foreach(Tarification_Ressource tar in tarRes)
            {
                db.Tarification_Ressource.Attach(tar);
                db.Tarification_Ressource.Remove(tar);                           
            }
            db.Ressource.Attach(ts); // ecouter les changement de l'objet 
            db.Ressource.Remove(ts); // remove l'objet ts
            db.SaveChanges(); // mettre a jour la table
        }
    }
}
