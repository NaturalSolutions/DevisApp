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
    public class TarificationController : ApiController // Objet de Tarification
    {
        private DevisFacturationEntities db; // attribut de contexte de bd (objet qui permet de faire les requetes a la base

        public TarificationController()
        {
            this.db = new DevisFacturationEntities();
        }

        // GET: api/Tarification
        public List<Tarification> Get() // Renvoie toute les tarification
        {
            //try
            //{
                List<Tarification> ts = db.Tarification.ToList();
                if (ts != null && ts.Count > 0) // verification de la nullité de la liste renvoyé
                {
                    return ts; // si c'est bon on renvoi la liste des taches
                }
                else
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Aucun élément dans la liste"));
                }
            //}
            //catch (Exception e)
            //{
            //    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message));
            //}
        }

        // GET: api/Tarification/5
        public Tarification Get(int id) // renvoi la tarification d'id ID
        {
            Tarification res = this.db.Tarification.Where(s => s.ID == id).FirstOrDefault();   // renvoi l'objet pointé par l'id pris en paramètre      
            if (res != null)
            {
                return res;
            }
            else
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "pas d'objet pour cet ID"));
            }
        }

        public struct tarifiClient
        {
            public string type;
            public decimal tar3;
            public decimal tar5;
            public bool isAmo;
        }

        // POST: api/Tarification
        public void Post(tarifiClient tarifclient) // creer et ajoute à la bd une nouvelle Tarification
        {
            Tarification nouveauTarif = new Tarification();
            nouveauTarif.Type = tarifclient.type;
            nouveauTarif.Tar3 = tarifclient.tar3;
            nouveauTarif.Tar5 = tarifclient.tar5;
            nouveauTarif.IsAmo = tarifclient.isAmo;
            nouveauTarif.Date = DateTime.Now;
            nouveauTarif.Obsolete = false;
            db.Tarification.Add(nouveauTarif);
            db.SaveChanges();
        }

        // PUT: api/Tarification/5
        public void Put(int id, [FromBody]Tarification tsk) // met a jour une Tarification a partir de son ID
        {
            try
            {
                if (tsk != null) // si l'objet source n'est pas null => update de la base
                {
                    Tarification ts = db.Tarification.Where(res => res.ID == id).FirstOrDefault(); // recuperer la tache pointé par l'id pris en paramètre de la fonction
                    db.Tarification.Attach(ts); // Faire ecouter le contexte de base de donnée sur les changements de l'objet ts 
                    ts.Type = tsk.Type; // changement des différents attribut de l'objet pointé avec les attributs de l'objet pris en paramètre
                    ts.Tar3 = tsk.Tar3; // same
                    ts.Tar5 = tsk.Tar5; // same 
                    ts.IsAmo = tsk.IsAmo; // same
                    ts.Date = tsk.Date; // same
                    ts.Obsolete = tsk.Obsolete; // same
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

        // DELETE: api/Tarification/5
        public void Delete(int id) // Détruit un objet Tarification a partir de son ID
        {
            Tarification tar = db.Tarification.Where(t => t.ID == id).FirstOrDefault(); // récupération de la tache pointé par l'id
            List<Tarification_Ressource> tarRes = db.Tarification_Ressource.Where(t => t.FK_Tarification == id).ToList();
            foreach (Tarification_Ressource tr in tarRes)
            {
                db.Tarification_Ressource.Attach(tr);
                db.Tarification_Ressource.Remove(tr);
            }
            db.Tarification.Attach(tar); // ecouter les changement de l'objet 
            db.Tarification.Remove(tar); // remove l'objet ts
            db.SaveChanges(); // mettre a jour la table
        }
    }
}
