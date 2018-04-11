using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication4.Models;

namespace WebApplication4.Controllers
{
    public class DevisController : ApiController
    {
        private Devis_Entities db;
        public DevisController()
        {
            this.db = new Devis_Entities(); // interface d'appel de la bd
        }
        // GET: api/Devis
        public IEnumerable<Devis> Get()
        {
            try
            {
                if((db.Devis.ToList() != null) && (!db.Devis.ToList().Any()))
                {
                    return db.Devis.ToList();
                }
                else
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound,"liste vide")); // lance une exception si la liste est vide
                }
            }catch(Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message));
            }
        }

        // GET: api/Devis/5
        public Devis Get(int id)
        {
            if(db.Devis.Where(res => res.ID == id).FirstOrDefault() != null)
            {
                return db.Devis.Where(res => res.ID == id).FirstOrDefault();
            }else
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Pas d'objet pour cet ID")); // lance une exception si il n'y a pas d'objet pour l'id visé
            }
            
        }

        // POST: api/Devis
        public void Post([FromBody]Devis devis)
        {
            try
            {
                if(devis != null)
                {
                    db.Devis.Add(devis);
                    db.SaveChanges();
                }
                else
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound,"Objet source null")); //lance exception si objet source est nulle
                }
            }
            catch(Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound,e.Message)); //lance exception si un attribut dans l'objet est nulle
            }
        }

        // PUT: api/Devis/5
        public void Put(int id, [FromBody]Devis value)
        {
            try
            {
                if(value != null)
                {
                    Devis res = db.Devis.Where(s => s.ID == id).FirstOrDefault();
                    db.Devis.Attach(res); // ecouteur de chamgement de l'objet
                    res.Mois = value.Mois;  // changement de valeur des attributs
                    res.Montant = value.Montant; // same
                    res.Numéro = value.Numéro; // same
                    res.Filename = value.Filename; // same
                    db.SaveChanges(); // mise a joue de la table
                }
                else
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Objet source null"));
                }
                
            }
            catch(Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message));
            }
        }

        // DELETE: api/Devis/5
        public void Delete(int id)
        {
            try
            {
                Devis devis = db.Devis.Where(s => s.ID == id).FirstOrDefault();
                db.Devis.Attach(devis);
                db.Devis.Remove(devis); // je remove l'objet associé à l'id visé
                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message));
            }
        }
    }
}
